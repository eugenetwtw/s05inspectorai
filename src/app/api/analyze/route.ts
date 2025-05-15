import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth, currentUser } from '@clerk/nextjs/server';
import { saveAnalysisHistory, upsertUser } from '../../../lib';
import { put } from '@vercel/blob';

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Parse the form data
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: '未提供照片' }, { status: 400 });
    }

    // Convert the file to a buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Create a prompt for the vision model
    const prompt = `
你是一位專業的工地安全與品質檢查專家。請仔細分析這張工地照片，並檢查以下方面的問題：

1. 安全問題：
   - 工人是否正確使用個人防護裝備（如安全帽、安全帶、護目鏡等）
   - 是否有墜落危險
   - 電氣安全問題
   - 機械操作安全問題
   - 其他可能的安全隱患

2. 衛生問題：
   - 工地環境是否整潔
   - 廢棄物處理是否適當
   - 是否有污染或有害物質暴露問題

3. 施工品質問題：
   - 是否有明顯的施工瑕疵
   - 材料使用是否適當
   - 施工技術是否符合標準
   - 是否有施工錯誤

請提供詳細的分析，並針對發現的問題提出改善建議。如果照片中沒有明顯問題，也請說明。

回覆格式：
1. 照片概述：（簡要描述照片內容）
2. 安全問題分析：（列出發現的安全問題）
3. 衛生問題分析：（列出發現的衛生問題）
4. 施工品質分析：（列出發現的施工品質問題）
5. 建議改善措施：（針對發現的問題提出具體改善建議）

請使用繁體中文回答。
`;

    // Call OpenAI API with the image
    console.log('Calling OpenAI API with image...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/${imageFile.type.split('/')[1]};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    console.log('OpenAI API response received');
    
    const analysisText = response.choices[0].message.content;
    
    // Get user information from Clerk
    const authData = await auth();
    const userId = authData.userId;
    let saved = false;
    
    // If user is authenticated, save the analysis to the database
    if (userId) {
      try {
        // We know userId is not null here because we're inside the if (userId) block
        const userIdString: string = userId!;
        // Get the full user data from Clerk
        const user = await currentUser();
        const email = user?.emailAddresses?.[0]?.emailAddress || '';
        
        // Ensure user exists in our database
        if (email) {
          await upsertUser(userIdString, email);
        } else {
          console.error('No email found for user:', userIdString);
          await upsertUser(userIdString, 'unknown@example.com'); // Fallback if email is not found
        }
        
        // Upload image to Vercel Blob instead of local filesystem
        const timestamp = Date.now();
        const filename = `${userIdString}_${timestamp}.${imageFile.type.split('/')[1]}`;
        
        // Upload to Vercel Blob
        const blob = await put(filename, imageFile, {
          access: 'public',
        });
        
        // Save analysis to database with Blob URL
        const imageUrl = blob.url;
        const metadata = {
          originalFilename: imageFile.name,
          mimeType: imageFile.type,
          size: imageFile.size,
          timestamp,
          blobId: blob.url
        };
        
        await saveAnalysisHistory(userIdString, imageUrl, analysisText, metadata);
        saved = true;
        
        console.log('Analysis saved to database with Blob URL:', imageUrl);
      } catch (dbError) {
        console.error('Error saving to database:', dbError);
        // Continue even if database save fails
      }
    } else {
      // For unauthenticated users, we can still upload to Blob but won't save to DB
      try {
        const timestamp = Date.now();
        const filename = `temp_${timestamp}.${imageFile.type.split('/')[1]}`;
        
        // Upload to Vercel Blob
        await put(filename, imageFile, {
          access: 'public',
        });
        
        console.log('Image saved to Blob storage (temporary)');
      } catch (saveError) {
        console.error('Error saving image to Blob:', saveError);
        // Continue even if image save fails
      }
    }
    
    // Return the analysis from OpenAI
    return NextResponse.json({
      analysis: analysisText,
      saved
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json({
      error: '分析照片時發生錯誤',
      details: error.message,
    }, { status: 500 });
  }
}
