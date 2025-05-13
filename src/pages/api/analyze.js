import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

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
                url: `data:image/${path.extname(imageFile.originalFilename).substring(1)};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    });

    console.log('OpenAI API response received');
    
    // Return the analysis from OpenAI
    return res.status(200).json({
      analysis: response.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    return res.status(500).json({
      error: '分析照片時發生錯誤',
      details: error.message,
    });
  }
}
