import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth, currentUser } from '@clerk/nextjs/server';
import { saveAnalysisHistory, upsertUser, sql } from '../../../lib';

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define prompts for different languages
const prompts = {
  'zh-TW': `
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
`,
  'zh-CN': `
你是一位专业的工地安全与品质检查专家。请仔细分析这张工地照片，并检查以下方面的问题：

1. 安全问题：
   - 工人是否正确使用个人防护装备（如安全帽、安全带、护目镜等）
   - 是否有坠落危险
   - 电气安全问题
   - 机械操作安全问题
   - 其他可能的安全隐患

2. 卫生问题：
   - 工地环境是否整洁
   - 废弃物处理是否适当
   - 是否有污染或有害物质暴露问题

3. 施工品质问题：
   - 是否有明显的施工瑕疵
   - 材料使用是否适当
   - 施工技术是否符合标准
   - 是否有施工错误

请提供详细的分析，并针对发现的问题提出改善建议。如果照片中没有明显问题，也请说明。

回复格式：
1. 照片概述：（简要描述照片内容）
2. 安全问题分析：（列出发现的安全问题）
3. 卫生问题分析：（列出发现的卫生问题）
4. 施工品质分析：（列出发现的施工品质问题）
5. 建议改善措施：（针对发现的问题提出具体改善建议）

请使用简体中文回答。
`,
  'en': `
You are a professional construction site safety and quality inspection expert. Please carefully analyze this construction site photo and check for issues in the following aspects:

1. Safety Issues:
   - Are workers correctly using personal protective equipment (such as helmets, safety belts, goggles, etc.)
   - Is there a risk of falling
   - Electrical safety issues
   - Mechanical operation safety issues
   - Other potential safety hazards

2. Hygiene Issues:
   - Is the construction site environment clean
   - Is waste disposal appropriate
   - Are there pollution or hazardous substance exposure issues

3. Construction Quality Issues:
   - Are there obvious construction defects
   - Is material use appropriate
   - Does the construction technique meet standards
   - Are there construction errors

Please provide a detailed analysis and suggest improvements for the issues found. If there are no obvious issues in the photo, please state so.

Response format:
1. Photo Overview: (Brief description of the photo content)
2. Safety Issue Analysis: (List the safety issues found)
3. Hygiene Issue Analysis: (List the hygiene issues found)
4. Construction Quality Analysis: (List the construction quality issues found)
5. Suggested Improvement Measures: (Provide specific improvement suggestions for the issues found)

Please answer in English.
`
};

// Error messages for different languages
const errorMessages = {
  'zh-TW': { noImage: '未提供照片', analyzeError: '分析照片時發生錯誤' },
  'zh-CN': { noImage: '未提供照片', analyzeError: '分析照片时发生错误' },
  'en': { noImage: 'No photo provided', analyzeError: 'Error analyzing photo' }
};

export async function POST(request: NextRequest) {
    try {
      // Parse the form data
      const formData = await request.formData();
      const imageFile = formData.get('image') as File;
      const batchNo = formData.get('batchNo') as string || '';
      const lang = formData.get('lang') as string || 'zh-TW'; // Default to Traditional Chinese
      
      // Validate language and set to default if invalid
      const validLang = ['zh-TW', 'zh-CN', 'en'].includes(lang) ? lang : 'zh-TW';
      
      if (!imageFile) {
        return NextResponse.json({ error: errorMessages[validLang].noImage }, { status: 400 });
      }
      
      console.log('Received batch number for analysis:', batchNo);
      console.log('Using language:', validLang);

    // Convert the file to a buffer
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Get the appropriate prompt based on language
    const prompt = prompts[validLang];

    // Call OpenAI API with the image
    console.log('Calling OpenAI API with image...');
    console.log('Using model: gpt-4o');
    console.log('Image type:', imageFile.type);
    console.log('Image size:', imageFile.size, 'bytes');
    console.log('Using language for prompt:', validLang);
    
    let response;
    try {
      response = await openai.chat.completions.create({
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
      console.log('OpenAI API response received successfully');
    } catch (openaiError) {
      console.error('Error calling OpenAI API:', openaiError);
      console.error('OpenAI Error details:', JSON.stringify(openaiError, null, 2));
      return NextResponse.json({
        error: '呼叫 OpenAI API 時發生錯誤',
        details: openaiError.message || '未知錯誤',
      }, { status: 500 });
    }
    
    const analysisText = response.choices[0].message.content;
    
    // Get user information from Clerk
    const authData = await auth();
    const userId = authData.userId;
    let saved = false;
    
    // If user is authenticated, save the analysis to the database
    if (userId) {
      console.log('User is authenticated with ID:', userId);
      try {
        // We know userId is not null here because we're inside the if (userId) block
        const userIdString: string = userId!;
        console.log('Processing analysis for authenticated user:', userIdString);
        
        // Get the full user data from Clerk
        const user = await currentUser();
        const email = user?.emailAddresses?.[0]?.emailAddress || '';
        console.log('User email from Clerk:', email || 'No email found');
        
        // Ensure user exists in our database
        if (email) {
          console.log('Upserting user with email:', email);
          await upsertUser(userIdString, email);
          console.log('User upserted successfully');
        } else {
          console.log('No email found for user, using fallback email');
          await upsertUser(userIdString, `user_${userIdString}@example.com`); // Fallback if email is not found
          console.log('User upserted with fallback email');
        }
        
        // Upload image to Supabase Storage
        const timestamp = Date.now();
        const filename = `${userIdString}_${timestamp}.${imageFile.type.split('/')[1]}`;
        console.log('Uploading image to Supabase Storage with filename:', filename);
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await sql.storage
          .from('analysis-images')
          .upload(filename, imageFile, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error('Error uploading image to Supabase Storage:', uploadError);
          throw new Error(`無法上傳圖片到儲存空間: ${uploadError.message}`);
        }
        
        console.log('Image uploaded successfully to path:', uploadData.path);
        
        // Get public URL for the uploaded file
        const { data: publicUrlData } = sql.storage
          .from('analysis-images')
          .getPublicUrl(filename);
        
        // Save analysis to database with Supabase Storage URL
        const imageUrl = publicUrlData.publicUrl;
        console.log('Generated public URL for image:', imageUrl);
        
        const metadata = {
          originalFilename: imageFile.name,
          mimeType: imageFile.type,
          size: imageFile.size,
          timestamp,
          storagePath: uploadData.path
        };
        
        console.log('Prepared metadata for analysis:', metadata);
        console.log('Attempting to save analysis to database with image URL:', imageUrl, 'and batch number:', batchNo);
        
        try {
          const savedAnalysis = await saveAnalysisHistory(userIdString, imageUrl, analysisText, metadata, batchNo);
          saved = true;
          console.log('Analysis successfully saved to database with ID:', savedAnalysis?.id);
        } catch (saveError) {
          console.error('Error saving analysis to database:', saveError);
          // Instead of silently failing, return the error to the client
          return NextResponse.json({
            analysis: analysisText,
            saved: false,
            error: 'Failed to save analysis to database',
            details: saveError.message
          }, { status: 500 });
        }
      } catch (dbError) {
        console.error('Error in database operations:', dbError);
        // Return the error to the client
        return NextResponse.json({
          analysis: analysisText,
          saved: false,
          error: 'Database operation failed',
          details: dbError.message
        }, { status: 500 });
      }
    } else {
      console.log('User is not authenticated, skipping database save');
      // For unauthenticated users, we can still upload to Supabase Storage but won't save to DB
      try {
        const timestamp = Date.now();
        const filename = `temp_${timestamp}.${imageFile.type.split('/')[1]}`;
        console.log('Uploading temporary image to Supabase Storage with filename:', filename);
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await sql.storage
          .from('analysis-images')
          .upload(filename, imageFile, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (uploadError) {
          console.error('Error uploading temporary image to Supabase Storage:', uploadError);
        } else {
          console.log('Temporary image saved to Supabase Storage at path:', uploadData.path);
        }
      } catch (saveError) {
        console.error('Error saving temporary image to Supabase Storage:', saveError);
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
      // Default to Traditional Chinese for errors
      return NextResponse.json({
        error: errorMessages['zh-TW'].analyzeError,
        details: error.message,
      }, { status: 500 });
  }
}
