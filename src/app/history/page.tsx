"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import ImageLightbox from '../../components/ImageLightbox';
import { toast } from 'react-hot-toast';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isTrashView, setIsTrashView] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
    }
  }, [isLoaded, isSignedIn, router]);

  // Fetch history when component mounts or when trash view changes
  useEffect(() => {
    if (isSignedIn) {
      fetchHistory();
    }
  }, [isSignedIn, isTrashView]);

  const fetchHistory = async () => {
    setLoading(true);
    setSelectedItems([]);
    try {
      const url = isTrashView 
        ? '/api/trash' 
        : '/api/history';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${isTrashView ? 'trash' : 'history'}`);
      }
      
      const data = await response.json();
      setHistory(isTrashView ? (data.trashItems || []) : (data.history || []));
    } catch (err) {
      console.error(`Error fetching ${isTrashView ? 'trash' : 'history'}:`, err);
      setError(isTrashView ? '獲取回收桶記錄時發生錯誤' : '獲取歷史記錄時發生錯誤');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };
  
  const toggleSelectAll = () => {
    if (selectedItems.length === history.length) {
      // If all are selected, deselect all
      setSelectedItems([]);
    } else {
      // Otherwise, select all
      setSelectedItems(history.map(item => item.id));
    }
  };
  
  const moveToTrash = async () => {
    if (selectedItems.length === 0) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch('/api/history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItems }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete items');
      }
      
      toast.success('已將所選項目移至回收桶');
      fetchHistory();
    } catch (err) {
      console.error('Error moving items to trash:', err);
      toast.error('移動項目至回收桶時發生錯誤');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const restoreFromTrash = async () => {
    if (selectedItems.length === 0) return;
    
    setIsRestoring(true);
    try {
      const response = await fetch('/api/trash', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItems }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to restore items');
      }
      
      toast.success('已恢復所選項目');
      fetchHistory();
    } catch (err) {
      console.error('Error restoring items from trash:', err);
      toast.error('恢復項目時發生錯誤');
    } finally {
      setIsRestoring(false);
    }
  };
  
  const permanentlyDelete = async () => {
    if (selectedItems.length === 0) return;
    
    if (!confirm('確定要永久刪除所選項目嗎？此操作無法撤銷。')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const response = await fetch('/api/trash', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItems }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to permanently delete items');
      }
      
      toast.success('已永久刪除所選項目');
      fetchHistory();
    } catch (err) {
      console.error('Error permanently deleting items:', err);
      toast.error('永久刪除項目時發生錯誤');
    } finally {
      setIsDeleting(false);
    }
  };

  const viewHistoryItem = (id, event) => {
    // Don't navigate if clicking on a checkbox
    if (event.target.type === 'checkbox') return;
    
    // Don't navigate if in trash view
    if (isTrashView) return;
    
    router.push(`/history/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold">{isTrashView ? '回收桶' : '歷史記錄'}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTrashView(!isTrashView)}
              className="text-sm py-1 px-3 bg-gray-200 hover:bg-gray-300 rounded-md transition-colors duration-200 flex items-center gap-1"
            >
              {isTrashView ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>返回歷史記錄</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>查看回收桶</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
              {isTrashView ? '回收桶（30天後自動刪除）' : '您的分析歷史記錄'}
            </h2>
            
            {history.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === history.length && history.length > 0}
                    onChange={toggleSelectAll}
                    className="mr-2 h-4 w-4"
                  />
                  全選
                </label>
                
                {selectedItems.length > 0 && (
                  <div className="flex gap-2">
                    {isTrashView ? (
                      <>
                        <button
                          onClick={restoreFromTrash}
                          disabled={isRestoring}
                          className="text-sm py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          恢復
                        </button>
                        <button
                          onClick={permanentlyDelete}
                          disabled={isDeleting}
                          className="text-sm py-1 px-3 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200 flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          永久刪除
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={moveToTrash}
                        disabled={isDeleting}
                        className="text-sm py-1 px-3 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200 flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        刪除
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>載入中...</p>
            </div>
          ) : error ? (
            <div className="p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {isTrashView ? '回收桶中沒有項目' : '尚無分析記錄'}
              </p>
              {!isTrashView && (
                <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                  返回上傳照片
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {history.map((item) => (
                <div 
                  key={item.id} 
                  className={`border rounded-md p-4 ${!isTrashView ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  onClick={(e) => viewHistoryItem(item.id, e)}
                >
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    {/* 選擇框 */}
                    <div className="absolute">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4"
                      />
                    </div>
                    
                    {/* 在手機上先顯示檔名/日期 */}
                    <div className="w-full md:hidden mb-3 ml-6">
                      <p className="text-sm text-gray-500 font-medium">
                        {new Date(item.created_at).toLocaleString('zh-TW')}
                        {item.deleted_at && (
                          <span className="ml-2 text-xs text-red-500">
                            （將於 {new Date(new Date(item.deleted_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-TW')} 永久刪除）
                          </span>
                        )}
                      </p>
                    </div>
                    
                    {/* 圖片區域 - 在手機上寬度 100% */}
                    <div 
                      className="w-full md:w-24 md:h-24 h-48 bg-gray-200 rounded overflow-hidden flex-shrink-0 mb-3 md:mb-0 relative group ml-6 md:ml-6"
                      onClick={(e) => {
                        e.stopPropagation(); // 防止觸發父元素的點擊事件
                        setLightboxImage(item.image_url);
                      }}
                    >
                      <img 
                        src={item.image_url} 
                        alt="分析照片" 
                        className="w-full h-full object-contain md:object-cover image-zoomable"
                      />
                      <div className="image-zoom-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* 文字內容區域 */}
                    <div className="flex-grow">
                      {/* 在桌面版顯示日期 */}
                      <p className="hidden md:block text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleString('zh-TW')}
                        {item.deleted_at && (
                          <span className="ml-2 text-xs text-red-500">
                            （將於 {new Date(new Date(item.deleted_at).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-TW')} 永久刪除）
                          </span>
                        )}
                      </p>
                      <p className="text-sm md:line-clamp-3 mt-1">
                        {item.analysis_text.substring(0, 200)}...
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} 工地安全與品質檢查 AI - 使用 AI 視覺模型
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
