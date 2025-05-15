"use client";

import { useState, useEffect } from 'react'; // Added useEffect for potential title updates
import Head from 'next/head';
import Link from 'next/link';
import { useLanguage } from '../../lib/i18n/LanguageContext'; // Import useLanguage
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

import { TranslationKeys } from '../../lib/i18n/translations'; // Import TranslationKeys

export default function Demo() {
  const [images, setImages] = useState<DemoImageItem[]>([
    {
      id: 1,
      name: "demoImage1Name", // Placeholder key
      url: "/60254.jpg",
      analysis: "",
      loading: false
    },
    {
      id: 2,
      name: "demoImage2Name", // Placeholder key
      url: "/60253.jpg",
      analysis: "",
      loading: false
    }
  ]);
  const [allLoading, setAllLoading] = useState(false);
  const [error, setError] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { t, language } = useLanguage(); // Initialize useLanguage

  useEffect(() => {
    document.title = t('demoPageTitle') || "Demo Page";
    // Update image names based on current language
    setImages(prevImages => prevImages.map(img => {
      const imageNameKey = `demoImage${img.id}Name` as keyof TranslationKeys;
      return {
        ...img,
        name: t(imageNameKey) || `demoImage${img.id}Name`, // Fallback to key
      };
    }));
  }, [t, language]);

  // Hardcoded analysis results are removed. They will be fetched using t() function.

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
        let analysisKey: keyof TranslationKeys;
        // Determine which analysis text to use based on the image's original ID or index
        if (updated[index].id === 1) {
          analysisKey = 'demoAnalysis1';
        } else if (updated[index].id === 2) {
          analysisKey = 'demoAnalysis2';
        } else {
          // Fallback or handle more images if necessary
          analysisKey = 'demoAnalysis3'; // Assuming a third analysis for any other image
        }
        
        updated[index] = { 
          ...updated[index], 
          analysis: t(analysisKey),
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
        return prev.map((img) => { // Iterate through images, index is not directly used for key here
          let analysisKey: keyof TranslationKeys;
          if (img.id === 1) {
            analysisKey = 'demoAnalysis1';
          } else if (img.id === 2) {
            analysisKey = 'demoAnalysis2';
          } else {
            analysisKey = 'demoAnalysis3'; // Fallback
          }
          
          return {
            ...img,
            analysis: t(analysisKey),
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
        alert(t('resultCopied')); // Use translated alert
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
            <h2 className="text-xl font-bold mb-4">{t('demoFeatureTitle')}</h2>
            <p className="mb-4">{t('demoFeatureDescription')}</p>
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md mb-4">
              <p>{t('demoNote')} <Link href="/history" className="text-blue-600 hover:text-blue-800">{t('history')}</Link>.</p>
            </div>
            <div className="flex space-x-4 mb-6">
              <button
                onClick={analyzeAllImages}
                disabled={allLoading}
                className={`py-2 px-4 rounded-md text-white font-medium ${
                  allLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors duration-200`}
              >
                {allLoading ? t('analyzing') : t('analyzeAllPhotosDemo')}
              </button>
            </div>
          </div>

          {/* 桌面版表格 - 只在中等尺寸以上顯示 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('fileName')}
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('photo')}
                  </th>
                  <th className="py-2 px-4 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('analysisResult')}
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
                          alt={`${t('sitePhotoAlt')} ${index + 1}`}
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
                          <p className="mt-2 text-sm text-gray-500">{t('analyzing')}</p>
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
                            title={t('copyResult')}
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
                          {t('analyzeThisPhotoDemo')}
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
                    alt={`${t('sitePhotoAlt')} ${index + 1}`}
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
                  <h4 className="text-sm font-medium text-gray-500 mb-2">{t('analysisResult')}</h4>
                  {img.loading ? (
                    <div className="text-center py-4">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                      <p className="mt-2 text-sm text-gray-500">{t('analyzing')}</p>
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
                        title={t('copyResult')}
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
                      {t('analyzeThisPhotoDemo')}
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
