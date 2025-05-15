# Construction Site Safety and Quality Inspection AI

This is an application that uses AI vision models to analyze construction site photos, detect safety and hygiene issues, construction defects or errors, and save analysis history for users to review.

## Features

- Upload construction site photos
- Analyze photos using OpenAI's vision model (GPT-4o)
- Detect safety issues (such as personal protective equipment usage, fall hazards, etc.)
- Detect hygiene issues (such as site cleanliness, waste disposal, etc.)
- Detect construction quality issues (such as construction defects, material usage, etc.)
- Provide improvement suggestions
- Copy analysis results
- User authentication and login system
- Save analysis history
- View historical analysis details
- History record management features:
  - Multi-select deletion
  - Select and delete by batch number
  - Trash bin functionality (auto-delete after 30 days)
  - Restore records from trash
  - Permanently delete records

## Technology Stack

- Next.js
- React
- Tailwind CSS
- OpenAI API (GPT-4o vision model)
- Clerk.com (user authentication)
- Supabase (PostgreSQL database and storage)

**Note**: This application has been migrated from Neon Database and Vercel Blob to Supabase for database management and file storage.

## Installation and Setup

1. Clone this project
```bash
git clone <repository-url>
cd construction-site-inspector
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file and add the following environment variables:

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

You will need:
- Create an API key at [OpenAI](https://platform.openai.com/)
- Create an application at [Clerk.com](https://clerk.com/) and obtain API keys
- Create a project at [Supabase](https://supabase.com/) and obtain the project URL and anonymous key

4. Set up Supabase database and storage

In Supabase, you need to create the following tables and storage bucket:

### Tables

#### users table
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### analysis_history table
```sql
CREATE TABLE analysis_history (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  image_url TEXT NOT NULL,
  analysis_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  batch_no TEXT DEFAULT '',
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes to improve query performance
CREATE INDEX idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX idx_analysis_history_deleted ON analysis_history(deleted);
CREATE INDEX idx_analysis_history_batch_no ON analysis_history(batch_no);
```

### Storage Bucket

Create a storage bucket named `analysis-images` in Supabase Storage.

### Storage Bucket Policies

Execute the following SQL commands in the Supabase SQL Editor to set up storage bucket policies:

```sql
-- Allow anyone to upload files
CREATE POLICY "Allow anyone to upload files"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'analysis-images');

-- Allow anyone to view/download files
CREATE POLICY "Allow anyone to view files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'analysis-images');

-- Allow anyone to update files
CREATE POLICY "Allow anyone to update files"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'analysis-images')
WITH CHECK (bucket_id = 'analysis-images');

-- Allow anyone to delete files
CREATE POLICY "Allow anyone to delete files"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'analysis-images');
```

### Table Policies

Set up Row-Level Security (RLS) policies for tables:

```sql
-- Enable RLS for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own data
CREATE POLICY "Users can view own data"
ON users FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Allow authenticated users to insert their own data
CREATE POLICY "Users can insert own data"
ON users FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Enable RLS for analysis_history table
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view their own analysis history
CREATE POLICY "Users can view own analysis history"
ON analysis_history FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow authenticated users to insert their own analysis history
CREATE POLICY "Users can insert own analysis history"
ON analysis_history FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Allow authenticated users to update their own analysis history
CREATE POLICY "Users can update own analysis history"
ON analysis_history FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- Allow authenticated users to delete their own analysis history
CREATE POLICY "Users can delete own analysis history"
ON analysis_history FOR DELETE
TO authenticated
USING (user_id = auth.uid());
```

5. Start the development server
```bash
npm run dev
```

6. Open your browser and visit `http://localhost:3000`

## Usage

1. Click the "Upload Construction Site Photo" button to select a construction site photo
2. Click the "Analyze Photo" button
3. Wait for the AI analysis to complete
4. View the analysis results, including safety issues, hygiene issues, construction quality issues, and improvement suggestions
5. If needed, click the "Copy Results" button to copy the analysis results to the clipboard

### History Record Management

1. View all analysis records on the "History" page
2. Use checkboxes to select one or more records
3. Use the batch number dropdown to select all records with the same batch number
4. Click the "Delete" button to move selected records to the trash bin
5. Click the "View Trash" button to switch to the trash bin view
6. In the trash bin, after selecting records, you can:
   - Click the "Restore" button to restore records from the trash bin
   - Click the "Permanently Delete" button to permanently delete records
7. Records in the trash bin will be automatically deleted after 30 days

## Notes

- Photo analysis takes some time, please be patient
- Analysis results are for reference only, actual construction issues still require on-site assessment by professionals
- Ensure uploaded photos are clear and visible to obtain more accurate analysis results

## License

MIT

---

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
- 歷史記錄管理功能：
  - 多選刪除功能
  - 按批次號碼選擇與刪除
  - 回收桶功能（30天後自動刪除）
  - 從回收桶恢復記錄
  - 永久刪除記錄

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

4. 設定 Supabase 資料庫和儲存

在 Supabase 中，您需要創建以下資料表和儲存桶：

### 資料表

#### users 表
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### analysis_history 表
```sql
CREATE TABLE analysis_history (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  image_url TEXT NOT NULL,
  analysis_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  batch_no TEXT DEFAULT '',
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 創建索引以提高查詢效能
CREATE INDEX idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX idx_analysis_history_deleted ON analysis_history(deleted);
CREATE INDEX idx_analysis_history_batch_no ON analysis_history(batch_no);
```

### 儲存桶

在 Supabase 儲存中創建一個名為 `analysis-images` 的儲存桶。

### 儲存桶權限策略

在 Supabase SQL 編輯器中執行以下 SQL 命令來設定儲存桶的權限策略：

```sql
-- 允許任何人上傳檔案
CREATE POLICY "Allow anyone to upload files"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'analysis-images');

-- 允許任何人查看/下載檔案
CREATE POLICY "Allow anyone to view files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'analysis-images');

-- 允許任何人更新檔案
CREATE POLICY "Allow anyone to update files"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'analysis-images')
WITH CHECK (bucket_id = 'analysis-images');

-- 允許任何人刪除檔案
CREATE POLICY "Allow anyone to delete files"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'analysis-images');
```

### 資料表權限策略

為資料表設定行級安全性 (RLS) 策略：

```sql
-- 啟用 users 表的 RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 允許已認證用戶查看自己的資料
CREATE POLICY "Users can view own data"
ON users FOR SELECT
TO authenticated
USING (id = auth.uid());

-- 允許已認證用戶插入自己的資料
CREATE POLICY "Users can insert own data"
ON users FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- 啟用 analysis_history 表的 RLS
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- 允許已認證用戶查看自己的分析歷史
CREATE POLICY "Users can view own analysis history"
ON analysis_history FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- 允許已認證用戶插入自己的分析歷史
CREATE POLICY "Users can insert own analysis history"
ON analysis_history FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 允許已認證用戶更新自己的分析歷史
CREATE POLICY "Users can update own analysis history"
ON analysis_history FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- 允許已認證用戶刪除自己的分析歷史
CREATE POLICY "Users can delete own analysis history"
ON analysis_history FOR DELETE
TO authenticated
USING (user_id = auth.uid());
```

5. 啟動開發伺服器
```bash
npm run dev
```

6. 開啟瀏覽器並訪問 `http://localhost:3000`

## 使用方法

1. 點擊「上傳工地照片」按鈕選擇一張工地照片
2. 點擊「分析照片」按鈕
3. 等待 AI 分析完成
4. 查看分析結果，包括安全問題、衛生問題、施工品質問題和改善建議
5. 如需要，點擊「複製結果」按鈕將分析結果複製到剪貼簿

### 歷史記錄管理

1. 在「歷史記錄」頁面查看所有分析記錄
2. 使用複選框選擇一個或多個記錄
3. 使用批次號碼下拉選單選擇同一批次的所有記錄
4. 點擊「刪除」按鈕將選中的記錄移至回收桶
5. 點擊「查看回收桶」按鈕切換到回收桶視圖
6. 在回收桶中選擇記錄後，可以：
   - 點擊「恢復」按鈕將記錄從回收桶恢復
   - 點擊「永久刪除」按鈕將記錄永久刪除
7. 回收桶中的記錄會在30天後自動刪除

## 注意事項

- 照片分析需要一定時間，請耐心等待
- 分析結果僅供參考，實際施工問題仍需專業人員現場評估
- 確保上傳的照片清晰可見，以獲得更準確的分析結果

## 授權

MIT
