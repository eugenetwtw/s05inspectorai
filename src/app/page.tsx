"use client";

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import ImageLightbox from '../components/ImageLightbox';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import Next Image

type ImageItem = {
  file: File;
  url: string;
  analysis: string;
  loading: boolean;
};

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [allLoading, setAllLoading] = useState(false);
  const [error, setError] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [batchNo, setBatchNo] = useState<string>('');
  const { isSignedIn, user } = useUser();
  const { t, language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      console.log('User is signed in, attempting to sync data to Supabase...');
      fetch('/api/user-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(response => {
          if (!response.ok) {
            console.error('Failed to sync user data:', response.status, response.statusText);
            return response.text().then(text => {
              console.error('Response details:', text);
            });
          } else {
            console.log('User data synced successfully');
          }
        })
        .catch(err => {
          console.error('Error syncing user data:', err);
        });
    } else {
      console.log('User is not signed in, skipping sync.');
    }
  }, [isSignedIn]);

  useEffect(() => {
    document.title = t('appName');
  }, [t, language]); // Added language to dependency array

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: ImageItem[] = [];
      const newBatchNo = Date.now().toString();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        newImages.push({
          file,
          url: URL.createObjectURL(file),
          analysis: '',
          loading: false
        });
      }
      
      setImages(newImages);
      setBatchNo(newBatchNo);
      setError('');
      console.log('New batch number set:', newBatchNo);
    }
  };

  const analyzeImage = async (index: number) => {
    if (images[index].loading) return;
    
    setImages(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], loading: true };
      return updated;
    });
    
    try {
      const formData = new FormData();
      formData.append('image', images[index].file);
      formData.append('batchNo', batchNo);
      formData.append('lang', language);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        // Consider using a translated error message here if possible
        throw new Error(t('analysisError') || '分析照片時發生錯誤');
      }

      const data = await response.json();
      
      setImages(prev => {
        const updated = [...prev];
        updated[index] = { 
          ...updated[index], 
          analysis: data.analysis,
          loading: false 
        };
        return updated;
      });
    } catch (err: any) {
      console.error('Error analyzing image:', err);
      setError(`${t('analysisError')}: ${err.message}`);
      
      setImages(prev => {
        const updated = [...prev];
        updated[index] = { ...updated[index], loading: false };
        return updated;
      });
    }
  };

  const analyzeAllImages = async () => {
    if (images.length === 0) {
      setError(t('uploadFirst'));
      return;
    }

    setAllLoading(true);
    setError('');

    try {
      for (let i = 0; i < images.length; i++) {
        if (!images[i].analysis) {
          await analyzeImage(i);
        }
      }
    } catch (err: any) {
      console.error('Error analyzing images:', err);
      setError(`${t('analysisError')}: ${err.message}`);
    } finally {
      setAllLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert(t('resultCopied'));
      })
      .catch(err => {
        console.error('Unable to copy to clipboard:', err);
      });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* CTA / Upload Section - Moved to the top as per user feedback */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">{t('heroCTA')}</h2>
          <p className="text-lg text-gray-600 mb-6">{t('appDescription')}</p>
          <label 
            htmlFor="image-upload" 
            className="inline-block cursor-pointer bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105 text-lg"
          >
            {t('uploadPhotos')}
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden" // Hide the default input, the label acts as the button
          />
        </div>
      </section>

      {/* Marketing Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-5xl font-bold mb-4">{t('heroTitle')}</h3>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">{t('heroSubtitle')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="rounded-lg overflow-hidden shadow-xl">
              <Image src="/60254.jpg" alt="Demo Site Photo 1" width={600} height={400} style={{objectFit: 'cover'}} />
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl">
              <Image src="/60253.jpg" alt="Demo Site Photo 2" width={600} height={400} style={{objectFit: 'cover'}}/>
            </div>
          </div>
        </div>
      </section>

      {/* Main content area for displaying uploaded images and results */}
      {images.length > 0 && (
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={analyzeAllImages}
                disabled={allLoading}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  allLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition-colors duration-200`}
              >
                {allLoading ? t('analyzing') : t('analyzeAllPhotos')}
              </button>
            </div>

            <div className="overflow-x-auto">
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
                    <tr key={index} className="border-b border-gray-200">
                      <td className="py-2 px-4 text-sm">
                        {img.file.name}
                      </td>
                      <td className="py-2 px-4">
                        <div 
                          className="w-48 h-32 bg-gray-200 rounded-md overflow-hidden relative group cursor-pointer"
                          onClick={() => setLightboxImage(img.url)}
                        >
                          <img
                            src={img.url}
                            alt={`${t('photo')} ${index + 1}`}
                            className="w-full h-full object-contain image-zoomable"
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
                            <div className="p-3 bg-gray-50 rounded-md border border-gray-200 max-h-64 overflow-y-auto text-sm">
                              <ReactMarkdown>{img.analysis}</ReactMarkdown>
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
                            {t('analyzeThisPhoto')}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {!isSignedIn && images.length === 0 && ( // Show login prompt only if not signed in AND no images are uploaded/displayed
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto text-center">
            <p className="text-gray-600">{t('loginToSave')}</p>
          </div>
        </main>
      )}

      {error && (
         <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto text-center">
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
            </div>
          </div>
        </main>
      )}

      <ImageLightbox 
        isOpen={lightboxImage !== null}
        imageUrl={lightboxImage || ''}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
