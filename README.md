# 工地安全與品質檢查 AI

這是一個使用 AI 視覺模型來分析工地照片的應用程式，可以檢測安全衛生問題、施工瑕疵或施工錯誤，並保存分析歷史記錄供用戶回顧。

## 功能

- 上傳工地照片
- 使用 OpenAI 的視覺模型 (GPT-4o) 分析照片
- 檢測安全問題（如個人防護裝備使用、墜落危險等）
- 檢測衛生問題（如工地整潔、廢棄物處理等）
- 檢測施工品質問題（如施工瑕疵、材料使用等）
- 提供改善建議
- 複製分析結果功能
- 用戶認證與登入系統
- 保存分析歷史記錄
- 查看歷史分析詳情

## 技術堆疊

- Next.js
- React
- Tailwind CSS
- OpenAI API (GPT-4o 視覺模型)
- Clerk.com (用戶認證)
- Supabase (PostgreSQL 資料庫與儲存)

**注意**：此應用程式已從 Neon Database 和 Vercel Blob 遷移到 Supabase，用於資料庫管理和檔案儲存。

## 安裝與設定

1. 克隆此專案
```bash
git clone <repository-url>
cd construction-site-inspector
```

2. 安裝依賴
```bash
npm install
```

3. 設定環境變數
創建 `.env.local` 檔案並添加以下環境變數：

```
# OpenAI API
OPENAI_API_KEY=your_openai_api_key

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase Database and Storage
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

您需要：
- 在 [OpenAI](https://platform.openai.com/) 創建 API 金鑰
- 在 [Clerk.com](https://clerk.com/) 創建應用程式並獲取 API 金鑰
- 在 [Supabase](https://supabase.com/) 創建專案並獲取專案 URL 和匿名金鑰

4. 啟動開發伺服器
```bash
npm run dev
```

5. 開啟瀏覽器並訪問 `http://localhost:3000`

## 使用方法

1. 點擊「上傳工地照片」按鈕選擇一張工地照片
2. 點擊「分析照片」按鈕
3. 等待 AI 分析完成
4. 查看分析結果，包括安全問題、衛生問題、施工品質問題和改善建議
5. 如需要，點擊「複製結果」按鈕將分析結果複製到剪貼簿

## 注意事項

- 照片分析需要一定時間，請耐心等待
- 分析結果僅供參考，實際施工問題仍需專業人員現場評估
- 確保上傳的照片清晰可見，以獲得更準確的分析結果

## 授權

MIT
