import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Initialize database on first load
async function initDatabase() {
  try {
    const response = await fetch('/api/init-db', {
      method: 'POST',
    });
    const data = await response.json();
    console.log('Database initialization:', data);
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

export default function Home() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Initialize database on first load
  useEffect(() => {
    initDatabase();
  }, []);

  // Mock login function for demo
  const login = () => {
    setIsLoggedIn(true);
    fetchHistory();
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      // In a real app, this would fetch from the API
      // For demo, we'll use mock data
      setHistory([
        {
          id: 1,
          image_url: '/60254.jpg',
          analysis_text: '1. 照片概述：照片顯示一根金屬支撐柱，上面纏繞著繩索或纖維材料作為加固或連接用途。支撐柱看起來位於一個建築工地內部，背景可見木板牆面和一些建築材料。',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          image_url: '/60254.jpg',
          analysis_text: '1. 照片概述：照片顯示一根金屬支撐柱，上面纏繞著繩索或纖維材料作為加固或連接用途。支撐柱看起來位於一個建築工地內部，背景可見木板牆面和一些建築材料。',
          created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ]);
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
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
      
      // Refresh history if the analysis was saved
      if (data.saved && isSignedIn) {
        setTimeout(fetchHistory, 1000); // Fetch after a delay to ensure DB update
      }
    } catch (err) {
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

  const viewHistoryItem = (id) => {
    router.push(`/history/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>工地安全與品質檢查 AI</title>
        <meta name="description" content="使用 AI 視覺模型分析工地照片，檢查安全衛生問題、施工瑕疵或錯誤" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">工地安全與品質檢查 AI</h1>
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-blue-600 hover:text-blue-800">
              查看示範
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link href="/history" className="text-blue-600 hover:text-blue-800">
                  歷史記錄
                </Link>
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm">
                  用戶
                </button>
              </div>
            ) : (
              <button 
                onClick={login}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                登入
              </button>
            )}
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

          {!isLoggedIn && (
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

        {isLoggedIn && history.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">最近的分析記錄</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.slice(0, 4).map((item) => (
                <div 
                  key={item.id} 
                  className="border rounded-md p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => viewHistoryItem(item.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
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
                        {item.analysis_text.substring(0, 100)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {history.length > 4 && (
              <div className="mt-4 text-center">
                <Link href="/history" className="text-blue-600 hover:text-blue-800">
                  查看全部歷史記錄
                </Link>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} 工地安全與品質檢查 AI - 使用 AI 視覺模型
      </footer>
    </div>
  );
}
