"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  SignedIn, 
  SignedOut, 
  UserButton, 
  useUser,
  SignInButton
} from '@clerk/nextjs';
import ImageLightbox from '../components/ImageLightbox';
import ReactMarkdown from 'react-markdown';
import LanguageSelector from '../components/LanguageSelector';
import { useLanguage } from '../lib/i18n/LanguageContext';
import { useRouter } from 'next/navigation';

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

  // Automatically sync user data to Supabase upon login
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

  // Update document title when language changes
  useEffect(() => {
    document.title = t('appName');
  }, [t]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages: ImageItem[] = [];
      const newBatchNo = Date.now().toString(); // Use timestamp as batch number
      
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
      formData.append('lang', language); // Add current language to the request

      console.log('Sending analysis request with batch number:', batchNo);
      console.log('Using language for analysis:', language);
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('分析照片時發生錯誤');
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
      setError('分析照片時發生錯誤: ' + err.message);
      
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
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">{t('appName')}</h1>
          <div className="flex items-center gap-4">
            <Link href="/demo" className="text-blue-600 hover:text-blue-800">
              {t('demo')}
            </Link>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link href="/history" className="text-blue-600 hover:text-blue-800">
                  {t('history')}
                </Link>
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                  {t('login')}
                </button>
              </SignInButton>
            </SignedOut>
            <LanguageSelector />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image-upload">
              {t('uploadPhotos')}
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          {images.length > 0 && (
            <>
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
            </>
          )}

          {!isSignedIn && (
            <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded-md">
              <p>{t('loginToSave')}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        {t('copyright')}
      </footer>

      {/* Lightbox for enlarged images */}
      <ImageLightbox 
        isOpen={lightboxImage !== null}
        imageUrl={lightboxImage || ''}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
