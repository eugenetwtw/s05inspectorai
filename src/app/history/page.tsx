"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch history when component mounts
  useEffect(() => {
    if (isSignedIn) {
      fetchHistory();
    }
  }, [isSignedIn]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/history');
      if (!response.ok) {
        throw new Error('Failed to fetch history');
      }
      const data = await response.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error('Error fetching history:', err);
      setError('獲取歷史記錄時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  const viewHistoryItem = (id) => {
    router.push(`/history/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold">歷史記錄</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-6">您的分析歷史記錄</h2>

          {loading ? (
            <div className="text-center py-8">
              <p>載入中...</p>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">尚無分析記錄</p>
              <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                返回上傳照片
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className="border rounded-md p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => viewHistoryItem(item.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image_url} 
                        alt="分析照片" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleString('zh-TW')}
                      </p>
                      <p className="text-sm line-clamp-3 mt-1">
                        {item.analysis_text.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} 工地安全與品質檢查 AI - 使用 OpenAI 視覺模型
      </footer>
    </div>
  );
}
