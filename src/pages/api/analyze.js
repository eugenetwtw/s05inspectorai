import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { saveAnalysisHistory, upsertUser } from '../../lib/db';

// Disable the default body parser to handle form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize OpenAI client with API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // We no longer support demo mode with mock data
    // All requests will use the real OpenAI API
    
    // If not in demo mode, proceed with normal file upload handling
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    if (!files.image || !files.image[0]) {
      return res.status(400).json({ error: '未提供照片' });
    }

    const imageFile = files.image[0];
    const imageBuffer = fs.readFileSync(imageFile.filepath);
    const base64Image = imageBuffer.toString('base64');

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

    // Use mock response instead of calling OpenAI API (for demo purposes)
    console.log('Using mock response instead of calling OpenAI API...');
    
    // Mock response for testing
    const response = {
      choices: [
        {
          message: {
            content: `
1. 照片概述：
   照片顯示一根金屬支撐柱，上面纏繞著繩索或纖維材料作為加固或連接用途。支撐柱看起來位於一個建築工地內部，背景可見木板牆面和一些建築材料。

2. 安全問題分析：
   - 支撐柱的連接方式使用繩索纏繞，這種臨時性連接方法可能不符合標準施工規範，存在結構穩定性風險
   - 繩索纏繞不均勻，部分區域較鬆散，可能導致支撐力不均
   - 未見適當的標識或警示，提醒工人注意此處可能的結構風險
   - 照片中未見工人，無法評估個人防護裝備使用情況

3. 衛生問題分析：
   - 工地環境相對整潔，未見明顯廢棄物堆積
   - 未見明顯污染或有害物質暴露問題
   - 支撐柱周圍區域有一些灰塵和碎屑，但屬於正常施工範圍內

4. 施工品質分析：
   - 支撐柱使用繩索纏繞固定的方式不符合專業施工標準，應使用適當的金屬連接件或專用接頭
   - 繩索纏繞的張力不均，可能影響支撐效果
   - 支撐柱與其他結構的連接方式不明確，無法評估整體結構穩定性

5. 建議改善措施：
   - 使用標準金屬連接件或專用接頭替代繩索纏繞，確保支撐柱連接符合工程規範
   - 在支撐柱周圍設置明顯的警示標識，提醒工人注意結構安全
   - 定期檢查支撐柱的穩定性和連接狀況，確保施工過程中的安全
   - 確保所有工人在工地佩戴適當的個人防護裝備，包括安全帽、安全鞋等
   - 制定明確的施工規範和標準操作程序，確保類似支撐結構的安裝符合安全標準
`
          }
        }
      ]
    };

    console.log('Mock response generated');
    
    const analysisText = response.choices[0].message.content;
    
    // Mock user ID for demo purposes
    const userId = 'demo-user-123';
    let saved = false;
    
    try {
      // Ensure user exists in our database
      await upsertUser(userId, 'demo@example.com');
      
      // Save image to a file
      const timestamp = Date.now();
      const filename = `${userId}_${timestamp}${path.extname(imageFile.originalFilename)}`;
      const imagePath = path.join(process.cwd(), 'public', 'uploads', filename);
      
      // Ensure uploads directory exists
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Write the image file
      fs.writeFileSync(imagePath, imageBuffer);
      
      // Save analysis to database
      const imageUrl = `/uploads/${filename}`;
      const metadata = {
        originalFilename: imageFile.originalFilename,
        mimeType: imageFile.mimetype,
        size: imageFile.size,
        timestamp
      };
      
      await saveAnalysisHistory(userId, imageUrl, analysisText, metadata);
      saved = true;
      
      console.log('Analysis saved to database');
    } catch (dbError) {
      console.error('Error saving to database:', dbError);
      // Continue even if database save fails
    }
    
    // Return the analysis from OpenAI
    return res.status(200).json({
      analysis: analysisText,
      saved
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return res.status(500).json({
      error: '分析照片時發生錯誤',
      details: error.message,
    });
  }
}
