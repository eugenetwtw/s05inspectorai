"use client";

import { useState } from 'react';
import Link from 'next/link';
import { 
  SignedIn, 
  SignedOut, 
  UserButton, 
  useUser,
  SignInButton
} from '@clerk/nextjs';

export default function Home() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isSignedIn, user } = useUser();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
      setAnalysis('');
      setError('');
    }
  };

  const analyzeImage = async () => {
    if (!image) {
      setError('請先上傳工地照片');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload the image for analysis
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('分析照片時發生錯誤');
      }

      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setError('分析照片時發生錯誤: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(analysis)
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
          <h1 className="text-xl font-bold">工地安全與品質檢查 AI</h1>
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-blue-600 hover:text-blue-800">
              查看示範
            </Link>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link href="/history" className="text-blue-600 hover:text-blue-800">
                  歷史記錄
                </Link>
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  登入
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image-upload">
              上傳工地照片
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {imageUrl && (
            <div className="mb-6">
              <p className="text-gray-700 text-sm font-bold mb-2">預覽照片</p>
              <div className="relative w-full h-64 bg-gray-200 rounded-md overflow-hidden">
                <img
                  src={imageUrl}
                  alt="工地照片預覽"
                  className="absolute inset-0 w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          <button
            onClick={analyzeImage}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors duration-200`}
          >
            {loading ? '分析中...' : '分析照片'}
          </button>

          {!isSignedIn && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
              <p>登入以保存分析結果並查看歷史記錄</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {analysis && (
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
                {analysis}
              </div>
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
