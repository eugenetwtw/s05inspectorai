"use client";

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

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
    }
  ]);
  const [allLoading, setAllLoading] = useState(false);
  const [error, setError] = useState('');

  // Predefined analysis result
  const demoAnalysisResult = `1. 照片概述：
照片顯示一根金屬支撐柱，上面纏繞著繩索或纖維材料作為加固或連接用途。支撐柱看起來位於一個建築工地內部，背景可見木板牆面和一些建築材料。

2. 安全問題分析：
- 支撐柱的纏繞方式可能不符合標準規範，繩索纏繞不均勻，可能影響支撐強度
- 未見明顯的安全標識或警示標記
- 支撐柱周圍環境雜亂，可能存在絆倒風險
- 無法確認支撐柱是否有適當的基座固定，可能存在穩定性問題

3. 衛生問題分析：
- 工作區域有灰塵和碎屑堆積
- 支撐柱表面有污漬和可能的鏽蝕
- 周圍環境整潔度不足，可能影響工作效率和安全

4. 施工品質分析：
- 支撐柱的纏繞工藝粗糙，不夠專業
- 纏繞材料選擇可能不適合長期支撐用途
- 支撐柱與周圍結構的連接方式不清晰，可能影響整體結構穩定性
- 支撐柱表面處理不佳，可能影響使用壽命

5. 建議改善措施：
- 重新評估支撐柱的設計和安裝方式，確保符合工程標準
- 使用專業的緊固件和連接材料，而非簡易繩索纏繞
- 清理工作區域，移除不必要的碎屑和障礙物
- 為支撐結構添加適當的安全標識和警示標記
- 定期檢查支撐結構的穩定性和完整性
- 考慮使用防鏽和防腐處理，延長支撐結構的使用壽命
- 確保所有工人了解正確的支撐結構安裝和維護程序`;

  // Second demo analysis for additional images
  const secondDemoAnalysisResult = `1. 照片概述：
照片顯示一個建築工地的鋼筋結構，可見多根垂直鋼筋和水平連接件。工地似乎處於基礎或地下室施工階段。

2. 安全問題分析：
- 鋼筋頂端未加保護套，存在刺傷風險
- 工作區域可能缺乏足夠的圍欄或警示標識
- 鋼筋間距不均勻，可能影響結構穩定性
- 未見工人使用適當的個人防護裝備

3. 衛生問題分析：
- 工地地面有積水和泥濘，可能滋生蚊蟲
- 建築材料堆放雜亂，未見適當的分類和覆蓋
- 周圍環境有建築垃圾未及時清理

4. 施工品質分析：
- 部分鋼筋彎曲角度不符合標準要求
- 鋼筋綁扎不夠牢固，部分連接點鬆動
- 混凝土澆築準備工作不充分，模板清理不徹底
- 鋼筋間距不均勻，可能影響結構承載力

5. 建議改善措施：
- 為所有外露鋼筋頂端加裝保護套，防止刺傷
- 加強工地圍欄和警示標識，限制非施工人員進入
- 重新檢查鋼筋綁扎質量，確保符合設計要求
- 清理工地積水和垃圾，改善工作環境
- 對施工人員進行安全培訓，強調個人防護裝備的重要性
- 建立定期質量檢查機制，及時發現並糾正施工問題`;

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

  const addDemoImage = () => {
    // Add more demo images if there are less than 3
    if (images.length < 3) {
      const newImages = [...images];
      
      if (images.length === 1) {
        newImages.push({
          id: 2,
          name: "鋼筋結構.jpg",
          url: "/60254.jpg", // Using the same image for demo
          analysis: "",
          loading: false
        });
      } else if (images.length === 2) {
        newImages.push({
          id: 3,
          name: "混凝土澆築.jpg",
          url: "/60254.jpg", // Using the same image for demo
          analysis: "",
          loading: false
        });
      }
      
      setImages(newImages);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
        <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">示範功能</h2>
            <p className="mb-4">這是一個示範頁面，展示多張照片上傳和分析功能。</p>
            
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
                      <div className="w-48 h-32 bg-gray-200 rounded-md overflow-hidden">
                        <img
                          src={img.url}
                          alt={`工地照片 ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
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
                          <div className="p-3 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-wrap max-h-64 overflow-y-auto text-sm">
                            {img.analysis}
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
                <div className="w-full h-48 bg-gray-200 rounded-md overflow-hidden mb-4">
                  <img
                    src={img.url}
                    alt={`工地照片 ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
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
                      <div className="p-3 bg-gray-50 rounded-md border border-gray-200 whitespace-pre-wrap max-h-64 overflow-y-auto text-sm leading-relaxed">
                        {img.analysis}
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

      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} 工地安全與品質檢查 AI - 使用 AI 視覺模型
      </footer>
    </div>
  );
}
