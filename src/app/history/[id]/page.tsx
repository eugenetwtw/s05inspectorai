"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import Image from 'next/image';

export default function HistoryDetail() {
  const params = useParams();
  const id = params.id as string;
  const [record, setRecord] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        setLoading(true);
        setIsUnauthorized(false);
        const response = await fetch(`/api/analysis/${id}`);
        
        if (response.status === 401) {
          setIsUnauthorized(true);
          return;
        }
        
        if (!response.ok) {
          throw new Error('無法獲取記錄詳細信息');
        }
        
        const data = await response.json();
        setRecord(data.record || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : '無法獲取記錄詳細信息');
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">工地安全與品質檢查 AI</h1>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              回到首頁
            </Link>
            <Link href="/history" className="text-blue-600 hover:text-blue-800">
              回到歷史記錄
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">分析記錄詳細信息</h2>
          {loading && <p className="text-gray-500">載入中...</p>}
          {error && <p className="text-red-500">錯誤: {error}</p>}
          {isUnauthorized && (
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md mb-4">
              <p className="mb-2">您需要登入才能查看記錄詳細信息。</p>
              <button
                onClick={() => window.location.href = '/'}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                返回首頁登入
              </button>
            </div>
          )}
          {!loading && !error && !isUnauthorized && !record && (
            <p className="text-gray-500">找不到該記錄。</p>
          )}
          {!loading && !error && record && (
            <div className="space-y-6">
              <div>
                <p className="font-medium">
                  分析日期: {format(new Date(record.created_at), 'yyyy/MM/dd HH:mm')}
                </p>
                {record.batch_no && <p className="text-sm text-gray-600">批次編號: {record.batch_no}</p>}
              </div>
              {record.image_url && (
                <div className="relative w-full h-64 md:h-96">
                  <Image
                    src={record.image_url}
                    alt="分析圖片"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold mb-2">分析結果:</h3>
                <pre className="whitespace-pre-wrap text-gray-700">{record.analysis_text}</pre>
              </div>
            </div>
          )}
          <div className="mt-6">
            <Link href="/history" className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              回到歷史記錄
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
