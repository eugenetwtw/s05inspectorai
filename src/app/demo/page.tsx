"use client";

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import ImageLightbox from '../../components/ImageLightbox';

type DemoImageItem = {
  id: number;
  name: string;
  url: string;
  analysis: string;
  loading: boolean;
};

export default function Demo() {
  const [images, setImages] = useState<DemoImageItem[]>([
    {
      id: 1,
      name: "工地支撐柱.jpg",
      url: "/60254.jpg",
      analysis: "",
      loading: false
    },
    {
      id: 2,
      name: "施工現場.jpg",
      url: "/60253.jpg",
      analysis: "",
      loading: false
    }
  ]);
  const [allLoading, setAllLoading] = useState(false);
  const [error, setError] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Predefined analysis result
  const demoAnalysisResult = `從公共安全和台灣工地相關法規的角度來看，這張照片顯示的工地存在以下安全風險：

1. **高處作業風險**：  
   照片顯示一個深坑，沒有明顯的護欄或安全圍欄。根據台灣《職業安全衛生法》和《營造安全衛生設施標準》，高處作業（高度超過2公尺）必須設置護欄、蓋板或安全網，避免人員墜落。

2. **地面雜物與絆倒風險**：  
   坑底有木板、垃圾和其他雜物，容易造成工人絆倒或滑倒。《營造安全衛生設施標準》第4條規定，工地應保持整潔，避免散落物導致意外。

3. **結構穩定性問題**：  
   混凝土牆上有突出的鋼筋，沒有妥善處理，可能刺傷工人或因結構不穩導致崩塌風險。根據法規，鋼筋端部應彎折或加裝保護蓋。

4. **照明不足**：  
   照片中光線昏暗，照明明顯不足。《營造安全衛生設施標準》第19條要求工地必須提供充足照明，確保工人能清楚辨識環境，避免意外。

5. **缺乏安全警示**：  
   沒有看到警示標誌或告示牌，提醒工人注意深坑危險。法規要求危險區域必須設置明顯的警示標誌。

**建議改善措施**：  
- 設置護欄或安全網，避免墜落。  
- 清理地面雜物，保持工作區域整潔。  
- 處理突出鋼筋，確保結構安全。  
- 提供充足照明，確保工作環境安全。  
- 設置警示標誌，提醒工人注意危險。

這些問題若不改善，可能違反台灣的職業安全法規，並增加工地意外的風險。`;

  // Second demo analysis for additional images
  const secondDemoAnalysisResult = `從公共安全和台灣工地相關法規的角度來看，這張照片顯示的工地存在以下安全風險：

1. **高處作業風險**：  
   照片顯示一個深坑，沒有明顯的護欄或安全圍欄。根據台灣《職業安全衛生法》和《營造安全衛生設施標準》，高處作業（高度超過2公尺）必須設置護欄、蓋板或安全網，避免人員墜落。

2. **地面雜物與絆倒風險**：  
   坑底有木板、垃圾和其他雜物，容易造成工人絆倒或滑倒。《營造安全衛生設施標準》第4條規定，工地應保持整潔，避免散落物導致意外。

3. **結構穩定性問題**：  
   混凝土牆上有突出的鋼筋，沒有妥善處理，可能刺傷工人或因結構不穩導致崩塌風險。根據法規，鋼筋端部應彎折或加裝保護蓋。

4. **照明不足**：  
   照片中光線昏暗，照明明顯不足。《營造安全衛生設施標準》第19條要求工地必須提供充足照明，確保工人能清楚辨識環境，避免意外。

5. **缺乏安全警示**：  
   沒有看到警示標誌或告示牌，提醒工人注意深坑危險。法規要求危險區域必須設置明顯的警示標誌。

**建議改善措施**：  
- 設置護欄或安全網，避免墜落。  
- 清理地面雜物，保持工作區域整潔。  
- 處理突出鋼筋，確保結構安全。  
- 提供充足照明，確保工作環境安全。  
- 設置警示標誌，提醒工人注意危險。

這些問題若不改善，可能違反台灣的職業安全法規，並增加工地意外的風險。`;

  // Third demo analysis
  const thirdDemoAnalysisResult = `1. 照片概述：
照片顯示一處建築工地的混凝土澆築工作，可見新澆築的混凝土表面和周圍的施工環境。工人正在進行表面處理作業。

2. 安全問題分析：
- 工作區域缺乏明確的安全警示標識
- 部分工人未佩戴安全帽或其他必要的防護裝備
- 電線和工具散亂放置，存在絆倒和觸電風險
- 工作平台邊緣缺乏防護欄杆，存在墜落風險

3. 衛生問題分析：
- 工地周圍有建築廢料和垃圾未及時清理
- 水泥和混凝土灰塵飛揚，可能影響工人健康和周圍環境
- 未見適當的洗手和清潔設施
- 工具和設備未妥善存放，可能導致污染擴散

4. 施工品質分析：
- 混凝土表面處理不均勻，存在凹凸不平現象
- 部分區域有蜂窩麻面現象，可能是振搗不充分導致
- 混凝土與模板接縫處理不當，存在漏漿現象
- 養護措施不足，可能影響混凝土強度發展

5. 建議改善措施：
- 加強工地安全管理，確保所有工人佩戴適當的個人防護裝備
- 設置明確的安全警示標識和防護欄杆
- 改進混凝土澆築和振搗工藝，確保密實度
- 加強混凝土養護工作，避免過早失水和開裂
- 建立工地清潔制度，及時清理廢料和垃圾
- 對施工人員進行專業技能培訓，提高施工質量意識
- 實施定期質量檢查和驗收制度，確保符合設計要求`;

  const analyzeImage = (index: number) => {
    // Set loading state
    setImages(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], loading: true };
      return updated;
    });

    // Simulate a short delay
    setTimeout(() => {
      setImages(prev => {
        const updated = [...prev];
        // Choose different analysis results based on index
        let result = demoAnalysisResult;
        if (index === 1) result = secondDemoAnalysisResult;
        if (index === 2) result = thirdDemoAnalysisResult;
        
        updated[index] = { 
          ...updated[index], 
          analysis: result,
          loading: false 
        };
        return updated;
      });
    }, 1000);
  };

  const analyzeAllImages = () => {
    setAllLoading(true);
    
    // Simulate analyzing all images with a delay
    setTimeout(() => {
      setImages(prev => {
        return prev.map((img, index) => {
          // Choose different analysis results based on index
          let result = demoAnalysisResult;
          if (index === 1) result = secondDemoAnalysisResult;
          if (index === 2) result = thirdDemoAnalysisResult;
          
          return {
            ...img,
            analysis: result,
            loading: false
          };
        });
      });
      setAllLoading(false);
    }, 2000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('分析結果已複製到剪貼簿');
      })
      .catch(err => {
        console.error('無法複製到剪貼簿:', err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">示範功能</h2>
            <p className="mb-4">這是一個示範頁面，展示多張照片上傳和分析功能。</p>
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md mb-4">
              <p>注意：這是示範頁面，使用的是模擬數據。查看實際的分析歷史記錄，請訪問 <Link href="/history" className="text-blue-600 hover:text-blue-800">歷史記錄頁面</Link>。</p>
            </div>
            <div className="flex space-x-4 mb-6">
              <button
                onClick={analyzeAllImages}
                disabled={allLoading}
                className={`py-2 px-4 rounded-md text-white font-medium ${
                  allLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors duration-200`}
              >
                {allLoading ? '分析中...' : '一鍵分析所有照片'}
              </button>
            </div>
          </div>

          {/* 桌面版表格 - 只在中等尺寸以上顯示 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    檔案名稱
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    照片
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    分析結果
                  </th>
                </tr>
              </thead>
              <tbody>
                {images.map((img, index) => (
                  <tr key={img.id} className="border-b border-gray-200">
                    <td className="py-2 px-4 text-sm">
                      {img.name}
                    </td>
                    <td className="py-2 px-4">
                      <div className="w-48 h-32 bg-gray-200 rounded-md overflow-hidden relative group">
                        <img
                          src={img.url}
                          alt={`工地照片 ${index + 1}`}
                          className="w-full h-full object-contain image-zoomable"
                          onClick={() => setLightboxImage(img.url)}
                        />
                        <div className="image-zoom-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 px-4">
                      {img.loading ? (
                        <div className="text-center py-4">
                          <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                          <p className="mt-2 text-sm text-gray-500">分析中...</p>
                        </div>
                      ) : img.analysis ? (
                        <div className="relative">
                          <div className="p-3 bg-gray-50 rounded-md border border-gray-200 max-h-64 overflow-y-auto text-sm prose prose-sm">
                            <ReactMarkdown>
                              {img.analysis}
                            </ReactMarkdown>
                          </div>
                          <button
                            onClick={() => copyToClipboard(img.analysis)}
                            className="absolute top-2 right-2 p-1 bg-white rounded-md shadow-sm hover:bg-gray-100"
                            title="複製結果"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => analyzeImage(index)}
                          className="py-1 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                        >
                          分析此照片
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* 手機版卡片佈局 - 只在小尺寸顯示 */}
          <div className="md:hidden space-y-6">
            {images.map((img, index) => (
              <div key={img.id} className="border rounded-md p-4 bg-white">
                {/* 檔案名稱 */}
                <h3 className="font-medium text-gray-800 mb-3">
                  {img.name}
                </h3>
                
                {/* 照片 */}
                <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden mb-4 relative group">
                  <img
                    src={img.url}
                    alt={`工地照片 ${index + 1}`}
                    className="w-full h-full object-contain image-zoomable"
                    onClick={() => setLightboxImage(img.url)}
                  />
                  <div className="image-zoom-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
                
                {/* 分析結果 */}
                <div className="mt-3">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">分析結果</h4>
                  {img.loading ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                      <p className="mt-2 text-sm text-gray-500">分析中...</p>
                    </div>
                  ) : img.analysis ? (
                    <div className="relative">
                      <div className="p-3 bg-gray-50 rounded-md border border-gray-200 max-h-64 overflow-y-auto text-sm leading-relaxed prose prose-sm">
                        <ReactMarkdown>
                          {img.analysis}
                        </ReactMarkdown>
                      </div>
                      <button
                        onClick={() => copyToClipboard(img.analysis)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-md shadow-sm hover:bg-gray-100"
                        title="複製結果"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => analyzeImage(index)}
                      className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md"
                    >
                      分析此照片
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>
      </main>


      {/* Lightbox for enlarged images */}
      <ImageLightbox 
        isOpen={lightboxImage !== null}
        imageUrl={lightboxImage || ''}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
