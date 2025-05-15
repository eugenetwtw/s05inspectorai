"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const offset = (page - 1) * limit;
        const response = await fetch(`/api/history?limit=${limit}&offset=${offset}`);
        if (!response.ok) {
          throw new Error('無法獲取歷史記錄');
        }
        const data = await response.json();
        setHistory(data.history || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : '無法獲取歷史記錄');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [page]);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch('/api/history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: [id] }),
      });
      if (!response.ok) {
        throw new Error('無法刪除記錄');
      }
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      alert('刪除失敗: ' + (err instanceof Error ? err.message : '未知錯誤'));
    }
  };

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
          <h2 className="text-2xl font-bold mb-4">分析歷史記錄</h2>
          {loading && <p className="text-gray-500">載入中...</p>}
          {error && <p className="text-red-500">錯誤: {error}</p>}
          {!loading && !error && history.length === 0 && (
            <p className="text-gray-500">沒有找到歷史記錄。</p>
          )}
          {!loading && !error && history.length > 0 && (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="border rounded-md p-4 flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      分析日期: {format(new Date(item.created_at), 'yyyy/MM/dd HH:mm')}
                    </p>
                    {item.batch_no && <p className="text-sm text-gray-600">批次編號: {item.batch_no}</p>}
                    <p className="text-sm text-gray-600 line-clamp-2">{item.analysis_text}</p>
                    <Link href={`/history/${item.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                      查看詳細內容
                    </Link>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    刪除
                  </button>
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
                  disabled={page === 1}
                >
                  上一頁
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  下一頁
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} 工地安全與品質檢查 AI - 使用 AI 視覺模型
      </footer>
    </div>
  );
}
