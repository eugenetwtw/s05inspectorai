import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Demo() {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const analyzeImage = async () => {
    setLoading(true);
    setError('');

    try {
      // Create a FormData object
      const formData = new FormData();
      
      // Fetch the demo image and add it to the form data
      const response = await fetch('/60254.jpg');
      const blob = await response.blob();
      const file = new File([blob], '60254.jpg', { type: 'image/jpeg' });
      formData.append('image', file);

      // Send the image for analysis
      const analysisResponse = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!analysisResponse.ok) {
        throw new Error('分析照片時發生錯誤');
      }

      const data = await analysisResponse.json();
      setAnalysis(data.analysis);
    } catch (err) {
      console.error('Error analyzing image:', err);
      
      // Try to get more details from the error response
      let errorDetails = err.message;
      try {
        if (err.response) {
          const errorData = await err.response.json();
          errorDetails = errorData.details || errorData.error || err.message;
          console.error('Error response data:', errorData);
        }
      } catch (jsonError) {
        console.error('Error parsing error response:', jsonError);
      }
      
      setError('分析照片時發生錯誤: ' + errorDetails);
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
      <Head>
        <title>示範 - 工地安全與品質檢查 AI</title>
        <meta name="description" content="使用 AI 視覺模型分析工地照片，檢查安全衛生問題、施工瑕疵或錯誤" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">工地安全與品質檢查 AI - 示範</h1>
          <div>
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              返回首頁
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">示範照片</h2>
            <div className="relative w-full h-64 bg-gray-200 rounded-md overflow-hidden">
              <img
                src="/60254.jpg"
                alt="工地照片示範"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <button
            onClick={analyzeImage}
            disabled={loading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } transition-colors duration-200`}
          >
            {loading ? '分析中...' : '分析照片'}
          </button>

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
