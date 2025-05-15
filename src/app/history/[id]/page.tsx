"use client";

import Link from 'next/link';

export default function HistoryDetail() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">工地安全與品質檢查 AI</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              回到首頁
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">歷史記錄功能已停用</h2>
          <p className="text-gray-700">很抱歉，歷史記錄功能目前不可用。如果您有任何問題或需要協助，請聯繫支持團隊。</p>
          <div className="mt-6">
            <Link href="/" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              回到首頁
            </Link>
          </div>
        </div>
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} 工地安全與品質檢查 AI - 使用 AI 視覺模型
      </footer>
    </div>
  );
}
