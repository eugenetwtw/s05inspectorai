"use client";

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Demo() {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
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

  const analyzeImage = () => {
    // No delay, just set the analysis result immediately
    setAnalysis(demoAnalysisResult);
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
