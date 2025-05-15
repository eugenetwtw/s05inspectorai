"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import ImageLightbox from '../../components/ImageLightbox';

export default function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isTrashView, setIsTrashView] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [trashItems, setTrashItems] = useState<any[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setIsUnauthorized(false);
        const offset = (page - 1) * limit;
        const showDeleted = isTrashView ? 'true' : 'false';
        const response = await fetch(`/api/history?limit=${limit}&offset=${offset}&showDeleted=${showDeleted}`);
        
        if (response.status === 401) {
          setIsUnauthorized(true);
          return;
        }
        
        if (!response.ok) {
          throw new Error('無法獲取歷史記錄');
        }
        
        const data = await response.json();
        if (isTrashView) {
          setTrashItems(data.history || []);
        } else {
          setHistory(data.history || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '無法獲取歷史記錄');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
    // Reset selected items when changing views or pages
    setSelectedItems([]);
  }, [page, isTrashView]);

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };
  
  const toggleSelectAll = () => {
    const currentItems = isTrashView ? trashItems : history;
    if (selectedItems.length === currentItems.length) {
      // If all are selected, deselect all
      setSelectedItems([]);
    } else {
      // Otherwise, select all
      setSelectedItems(currentItems.map(item => item.id));
    }
  };

  const handleDelete = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch('/api/history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItems }),
      });
      
      if (!response.ok) {
        throw new Error('無法刪除記錄');
      }
      
      setHistory(history.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      alert('已將所選項目移至回收桶');
    } catch (err) {
      alert('刪除失敗: ' + (err instanceof Error ? err.message : '未知錯誤'));
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleRestore = async () => {
    if (selectedItems.length === 0) return;
    
    try {
      setIsRestoring(true);
      const response = await fetch('/api/trash', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItems }),
      });
      
      if (!response.ok) {
        throw new Error('無法恢復記錄');
      }
      
      setTrashItems(trashItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      alert('已恢復所選項目');
    } catch (err) {
      alert('恢復失敗: ' + (err instanceof Error ? err.message : '未知錯誤'));
    } finally {
      setIsRestoring(false);
    }
  };
  
  const handlePermanentDelete = async () => {
    if (selectedItems.length === 0) return;
    
    if (!confirm('確定要永久刪除所選項目嗎？此操作無法撤銷。')) {
      return;
    }
    
    try {
      setIsDeleting(true);
      const response = await fetch('/api/trash', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: selectedItems }),
      });
      
      if (!response.ok) {
        throw new Error('無法永久刪除記錄');
      }
      
      setTrashItems(trashItems.filter(item => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      alert('已永久刪除所選項目');
    } catch (err) {
      alert('永久刪除失敗: ' + (err instanceof Error ? err.message : '未知錯誤'));
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Group items by batch number
  const getBatchNumbers = () => {
    const items = isTrashView ? trashItems : history;
    const batches = new Set<string>();
    
    items.forEach(item => {
      if (item.batch_no) {
        batches.add(item.batch_no);
      }
    });
    
    return Array.from(batches);
  };
  
  const handleSelectBatch = (batchNo: string) => {
    const items = isTrashView ? trashItems : history;
    const batchItems = items
      .filter(item => item.batch_no === batchNo)
      .map(item => item.id);
    
    setSelectedItems(batchItems);
  };

  // Get the current items based on the view
  const currentItems = isTrashView ? trashItems : history;
  const batchNumbers = getBatchNumbers();

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
              onClick={() => {
                setIsTrashView(!isTrashView);
                setSelectedItems([]);
                setPage(1);
              }}
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
        <div className="bg-white rounded-lg shadow-md p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">
              {isTrashView ? '回收桶（30天後自動刪除）' : '您的分析歷史記錄'}
            </h2>
            
            {currentItems.length > 0 && (
              <div className="flex items-center gap-2">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === currentItems.length && currentItems.length > 0}
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
                          onClick={handleRestore}
                          disabled={isRestoring}
                          className="text-sm py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                          </svg>
                          恢復
                        </button>
                        <button
                          onClick={handlePermanentDelete}
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
                        onClick={handleDelete}
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
          
          {/* Batch selection dropdown */}
          {batchNumbers.length > 0 && !isTrashView && (
            <div className="mb-4">
              <select 
                className="p-2 border rounded-md text-sm"
                onChange={(e) => {
                  if (e.target.value) {
                    handleSelectBatch(e.target.value);
                  }
                }}
                value=""
              >
                <option value="">選擇批次號碼...</option>
                {batchNumbers.map(batch => (
                  <option key={batch} value={batch}>批次: {batch}</option>
                ))}
              </select>
            </div>
          )}
          
          {loading && <p className="text-gray-500">載入中...</p>}
          {error && <p className="text-red-500">錯誤: {error}</p>}
          {isUnauthorized && (
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md mb-4">
              <p className="mb-2">您需要登入才能查看歷史記錄。</p>
              <button
                onClick={() => window.location.href = '/'}
                className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                返回首頁登入
              </button>
            </div>
          )}
          {!loading && !error && !isUnauthorized && currentItems.length === 0 && (
            <p className="text-gray-500">
              {isTrashView ? '回收桶中沒有項目' : '沒有找到歷史記錄。'}
            </p>
          )}
          
          {!loading && !error && currentItems.length > 0 && (
            <div className="space-y-4">
              {currentItems.map((item) => (
                <div key={item.id} className="border rounded-md p-4 relative">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {/* Checkbox */}
                      <div className="flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => toggleItemSelection(item.id)}
                          className="h-5 w-5 cursor-pointer border-2 border-gray-300"
                        />
                      </div>
                      
                      {/* Image thumbnail */}
                      {item.image_url && (
                        <div 
                          className="relative w-16 h-16 flex-shrink-0 cursor-pointer"
                          onClick={() => setLightboxImage(item.image_url)}
                        >
                          <Image
                            src={item.image_url}
                            alt="分析圖片"
                            fill
                            sizes="64px"
                            className="rounded-md object-cover"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-grow">
                        <p className="font-medium">
                          分析日期: {format(new Date(item.created_at), 'yyyy/MM/dd HH:mm')}
                        </p>
                        {item.batch_no && <p className="text-sm text-gray-600">批次編號: {item.batch_no}</p>}
                        <p className="text-sm text-gray-600 line-clamp-2">{item.analysis_text}</p>
                        
                        {!isTrashView ? (
                          <Link href={`/history/${item.id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                            查看詳細內容
                          </Link>
                        ) : item.deleted_at && (
                          <p className="text-xs text-red-500 mt-1">
                            將於 {format(new Date(new Date(item.deleted_at).getTime() + 30 * 24 * 60 * 60 * 1000), 'yyyy/MM/dd')} 永久刪除
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => setPage(page > 1 ? page - 1 : 1)}
                  className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
                  disabled={page === 1}
                >
                  上一頁
                </button>
                <button
                  onClick={() => setPage(page + 1)}
                  className="py-2 px-4 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                  下一頁
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} 工地安全與品質檢查 AI - 使用 AI 視覺模型
      </footer>
      
      {/* Lightbox for enlarged images */}
      {lightboxImage && (
        <ImageLightbox 
          isOpen={lightboxImage !== null}
          imageUrl={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
}
