"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function HistoryDetail() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const id = params.id;
  const { isSignedIn, isLoaded } = useUser();

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch analysis when id is available
  useEffect(() => {
    if (isSignedIn && id) {
      fetchAnalysis();
    }
  }, [isSignedIn, id]);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/analysis/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analysis');
      }
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      console.error('Error fetching analysis:', err);
      setError('獲取分析記錄時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!analysis) return;
    
    navigator.clipboard.writeText(analysis.analysis_text)
      .then(() => {
        alert('分析結果已複製到剪貼簿');
      })
      .catch(err => {
        console.error('無法複製到剪貼簿:', err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/history" className="text-blue-600 hover:text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold">分析詳情</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">
            <p>載入中...</p>
          </div>
        ) : error ? (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        ) : analysis ? (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">
                {new Date(analysis.created_at).toLocaleString('zh-TW')}
              </p>
              <div className="w-full h-64 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={analysis.image_url}
                  alt="工地照片"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold">分析結果</h3>
                <button
                  onClick={copyToClipboard}
                  className="text-sm py-1 px-3 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200"
                >
                  複製結果
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-wrap">
                {analysis.analysis_text}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Link href="/history" className="text-blue-600 hover:text-blue-800">
                返回歷史記錄
              </Link>
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                分析新照片
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">找不到分析記錄</p>
            <Link href="/history" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              返回歷史記錄
            </Link>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} 工地安全與品質檢查 AI - 使用 OpenAI 視覺模型
      </footer>
    </div>
  );
}
