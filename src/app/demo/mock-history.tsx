"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import ImageLightbox from '../../components/ImageLightbox';

// Mock data for testing
const mockHistoryData = [
  {
    id: 1,
    user_id: "user123",
    image_url: "/60253.jpg",
    analysis_text: "抱歉，我無法檢視或辨識圖片內容。然而，我可以告訴您如何進行工地安全與品質檢查。以下是建議的檢查步驟：\n1. **安全問題分析**：- 確認工人是否正確配戴安全裝備，如安全帽、安全帶和護目鏡。- 評估現場有無墜落危險，特別是高空作業區域需設置護欄或安全網。- 檢查電線和電設備是否有裸露、有無絕緣破損。- 確保重型機械操作安全，包括適當的警示標誌和隔離措施。",
    created_at: "2025-05-14T04:19:34.000Z",
    deleted: false,
    deleted_at: null,
    metadata: {}
  },
  {
    id: 2,
    user_id: "user123",
    image_url: "/60254.jpg",
    analysis_text: "抱歉，我無法查看或分析這張照片的人物。但我可以介紹一些檢查工地安全的要點，供您參考：\n1. 照片概述：- 這張照片展示了一個建築工地的場景，有多層鋼結構和建築材料。\n2. 安全問題分析：- 確保工人佩戴適當的個人防護裝備，如安全帽、安全帶等。- 注意鋼結構上的墜落風險，檢查是否有適當的圍欄和標誌。- 確保電氣設備和電線的安全性，避免觸電危險。",
    created_at: "2025-05-14T04:19:04.000Z",
    deleted: false,
    deleted_at: null,
    metadata: {}
  },
  {
    id: 3,
    user_id: "user123",
    image_url: "/60253.jpg",
    analysis_text: "I'm sorry, I can't assist with that....",
    created_at: "2025-05-14T04:17:44.000Z",
    deleted: false,
    deleted_at: null,
    metadata: {}
  }
];

export default function MockHistory() {
  const [history, setHistory] = useState(mockHistoryData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isTrashView, setIsTrashView] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [trashItems, setTrashItems] = useState<any[]>([]);

  // Initialize trash items
  useEffect(() => {
    // Create some mock trash items
    setTrashItems([
      {
        id: 4,
        user_id: "user123",
        image_url: "/60254.jpg",
        analysis_text: "抱歉，我無法提供這張照片的詳細分析或檢查。一般工地安全與質量檢查應遵循合格的專業人員在現場依據標準進行。如果需要，建議請專業的安全和質量檢查員到現場進行評估。若有任何具體問題或需改善的地方，請參考現場管理手冊或相關標準進行檢查和改進。...",
        created_at: "2025-05-13T00:25:50.000Z",
        deleted: true,
        deleted_at: "2025-05-14T08:30:00.000Z",
        metadata: {}
      }
    ]);
  }, []);

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
  
  const moveToTrash = async () => {
    if (selectedItems.length === 0) return;
    
    setIsDeleting(true);
    try {
      // Simulate a short delay to mimic API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock moving items to trash
      const now = new Date().toISOString();
      const itemsToMove = history.filter(item => selectedItems.includes(item.id));
      
      if (itemsToMove.length === 0) {
        throw new Error('No items found with the selected IDs');
      }
      
      const updatedItems = itemsToMove.map(item => ({
        ...item,
        deleted: true,
        deleted_at: now
      }));
      
      // Update history and trash items
      setHistory(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setTrashItems(prev => [...prev, ...updatedItems]);
      
      toast.success('已將所選項目移至回收桶');
      setSelectedItems([]);
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
      // Simulate a short delay to mimic API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock restoring items from trash
      const itemsToRestore = trashItems.filter(item => selectedItems.includes(item.id));
      
      if (itemsToRestore.length === 0) {
        throw new Error('No items found with the selected IDs');
      }
      
      const updatedItems = itemsToRestore.map(item => ({
        ...item,
        deleted: false,
        deleted_at: null
      }));
      
      // Update history and trash items
      setTrashItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      setHistory(prev => [...prev, ...updatedItems]);
      
      toast.success('已恢復所選項目');
      setSelectedItems([]);
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
      // Simulate a short delay to mimic API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if items exist
      const itemsToDelete = trashItems.filter(item => selectedItems.includes(item.id));
      
      if (itemsToDelete.length === 0) {
        throw new Error('No items found with the selected IDs');
      }
      
      // Mock permanently deleting items
      setTrashItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
      
      toast.success('已永久刪除所選項目');
      setSelectedItems([]);
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
    
    // Mock navigation - just show a toast
    toast.success(`查看項目 #${id} 的詳情`);
  };

  // Get the current items based on the view
  const currentItems = isTrashView ? trashItems : history;

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
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">
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
          ) : currentItems.length === 0 ? (
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
              {currentItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`border rounded-md p-4 relative ${!isTrashView ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                  onClick={(e) => viewHistoryItem(item.id, e)}
                >
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    {/* 選擇框 */}
                    <div className="absolute top-4 left-4 z-10">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-5 w-5 cursor-pointer border-2 border-gray-300"
                      />
                    </div>
                    
                    {/* 在手機上先顯示檔名/日期 */}
                    <div className="w-full md:hidden mb-3 ml-8">
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
                      className="w-full md:w-24 md:h-24 h-48 bg-gray-200 rounded overflow-hidden flex-shrink-0 mb-3 md:mb-0 relative group ml-8 md:ml-8"
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
