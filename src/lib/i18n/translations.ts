// Translation keys for the application

export type Language = 'zh-TW' | 'zh-CN' | 'en';

export type TranslationKeys = {
  // Common
  appName: string;
  appDescription: string;
  
  // Navigation
  demo: string;
  history: string;
  login: string;
  
  // Main page
  uploadPhotos: string;
  analyzeAllPhotos: string;
  analyzing: string;
  analyzeThisPhoto: string;
  fileName: string;
  photo: string;
  analysisResult: string;
  loginToSave: string;
  copyResult: string;
  resultCopied: string;
  
  // Errors
  uploadFirst: string;
  analysisError: string;
  
  // Footer
  copyright: string;

  // Demo Page Specific
  demoPageTitle: string;
  demoFeatureTitle: string;
  demoFeatureDescription: string;
  demoNote: string;
  analyzeAllPhotosDemo: string;
  analyzeThisPhotoDemo: string;
  sitePhotoAlt: string;
};

export const translations: Record<Language, TranslationKeys> = {
  'zh-TW': {
    // Common
    appName: '工地安全與品質檢查 AI',
    appDescription: '使用 AI 視覺模型分析工地照片，檢查安全衛生問題、施工瑕疵或錯誤',
    
    // Navigation
    demo: '查看示範',
    history: '歷史記錄',
    login: '登入',
    
    // Main page
    uploadPhotos: '上傳工地照片',
    analyzeAllPhotos: '一鍵分析所有照片',
    analyzing: '分析中...',
    analyzeThisPhoto: '分析此照片',
    fileName: '檔案名稱',
    photo: '照片',
    analysisResult: '分析結果',
    loginToSave: '登入以保存分析結果',
    copyResult: '複製結果',
    resultCopied: '分析結果已複製到剪貼簿',
    
    // Errors
    uploadFirst: '請先上傳工地照片',
    analysisError: '分析照片時發生錯誤',
    
    // Footer
    copyright: '© {year} 工地安全與品質檢查 AI - 使用 AI 視覺模型',

    // Demo Page Specific
    demoPageTitle: '示範頁面 - 工地 AI 檢查',
    demoFeatureTitle: '示範功能',
    demoFeatureDescription: '這是一個示範頁面，展示多張照片上傳和分析功能。',
    demoNote: '注意：這是示範頁面，使用的是模擬數據。查看實際的分析歷史記錄，請訪問', // "歷史記錄頁面" part is a link, handled in component
    analyzeAllPhotosDemo: '一鍵分析所有示範照片',
    analyzeThisPhotoDemo: '分析此示範照片',
    sitePhotoAlt: '工地照片示範',
  },
  'zh-CN': {
    // Common
    appName: '工地安全与品质检查 AI',
    appDescription: '使用 AI 视觉模型分析工地照片，检查安全卫生问题、施工瑕疵或错误',
    
    // Navigation
    demo: '查看示范',
    history: '历史记录',
    login: '登录',
    
    // Main page
    uploadPhotos: '上传工地照片',
    analyzeAllPhotos: '一键分析所有照片',
    analyzing: '分析中...',
    analyzeThisPhoto: '分析此照片',
    fileName: '文件名称',
    photo: '照片',
    analysisResult: '分析结果',
    loginToSave: '登录以保存分析结果',
    copyResult: '复制结果',
    resultCopied: '分析结果已复制到剪贴板',
    
    // Errors
    uploadFirst: '请先上传工地照片',
    analysisError: '分析照片时发生错误',
    
    // Footer
    copyright: '© {year} 工地安全与品质检查 AI - 使用 AI 视觉模型',

    // Demo Page Specific
    demoPageTitle: '示范页面 - 工地 AI 检查',
    demoFeatureTitle: '示范功能',
    demoFeatureDescription: '这是一个示范页面，展示多张照片上传和分析功能。',
    demoNote: '注意：这是示范页面，使用的是模拟数据。查看实际的分析历史记录，请访问',
    analyzeAllPhotosDemo: '一键分析所有示范照片',
    analyzeThisPhotoDemo: '分析此示范照片',
    sitePhotoAlt: '工地照片示范',
  },
  'en': {
    // Common
    appName: 'Construction Site Safety & Quality Inspection AI',
    appDescription: 'Use AI vision models to analyze construction site photos, check safety issues, construction defects or errors',
    
    // Navigation
    demo: 'View Demo',
    history: 'History',
    login: 'Login',
    
    // Main page
    uploadPhotos: 'Upload Construction Site Photos',
    analyzeAllPhotos: 'Analyze All Photos',
    analyzing: 'Analyzing...',
    analyzeThisPhoto: 'Analyze This Photo',
    fileName: 'File Name',
    photo: 'Photo',
    analysisResult: 'Analysis Result',
    loginToSave: 'Login to save analysis results',
    copyResult: 'Copy Result',
    resultCopied: 'Analysis result copied to clipboard',
    
    // Errors
    uploadFirst: 'Please upload construction site photos first',
    analysisError: 'Error analyzing photo',
    
    // Footer
    copyright: '© {year} Construction Site Safety & Quality Inspection AI - Using AI Vision Models',

    // Demo Page Specific
    demoPageTitle: 'Demo Page - Site AI Inspection',
    demoFeatureTitle: 'Demo Feature',
    demoFeatureDescription: 'This is a demo page showcasing multi-photo upload and analysis functionality.',
    demoNote: 'Note: This is a demo page using mock data. To view actual analysis history, please visit the',
    analyzeAllPhotosDemo: 'Analyze All Demo Photos',
    analyzeThisPhotoDemo: 'Analyze This Demo Photo',
    sitePhotoAlt: 'Site Photo Demo',
  },
};
