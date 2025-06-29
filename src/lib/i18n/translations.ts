// Translation keys for the application

export type Language = 'zh-TW' | 'zh-CN' | 'en' | 'de'; // Added 'de'

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

  // Demo Page - Image specific content
  demoImage1Name: string;
  demoImage2Name: string;
  demoAnalysis1: string;
  demoAnalysis2: string;
  demoAnalysis3: string; // For the third potential analysis

  // History Page
  historyPageTitle: string;
  trashBinPageTitle: string;
  viewTrashBin: string;
  returnToHistory: string;
  yourAnalysisHistory: string;
  trashBinInfo: string;
  selectAll: string;
  restore: string;
  deletePermanently: string;
  deleteAction: string; // For "Move to Trash" action
  selectBatchNumber: string;
  batchPrefix: string;
  loading: string;
  errorPrefix: string;
  unauthorizedMessage: string;
  loginReturnHome: string;
  noHistoryItems: string;
  noTrashItems: string;
  analysisDatePrefix: string;
  batchNumberPrefix: string;
  viewDetails: string;
  willBePermanentlyDeletedOn: string; // e.g. "Will be permanently deleted on {date}"
  previousPage: string;
  nextPage: string;
  confirmPermanentDelete: string;
  itemsMovedToTrash: string;
  deleteFailed: string;
  itemsRestored: string;
  restoreFailed: string;
  itemsPermanentlyDeleted: string;
  permanentDeleteFailed: string;
  errorFetchingHistory: string;
  errorDeletingRecord: string;
  errorRestoringRecord: string;
  errorPermanentlyDeletingRecord: string;
  analyzedImageAlt: string;

  // Homepage Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string; // Call to action, might be same as 'uploadPhotos' or new
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
    copyright: '© {year} 工地安全與品質檢查 AI - 使用 AI 視覺模型 - 張渝江技師設計',

    // Demo Page Specific
    demoPageTitle: '示範頁面 - 工地 AI 檢查',
    demoFeatureTitle: '示範功能',
    demoFeatureDescription: '這是一個示範頁面，展示多張照片上傳和分析功能。',
    demoNote: '注意：這是示範頁面，使用的是模擬數據。查看實際的分析歷史記錄，請訪問', // "歷史記錄頁面" part is a link, handled in component
    analyzeAllPhotosDemo: '一鍵分析所有示範照片',
    analyzeThisPhotoDemo: '分析此示範照片',
    sitePhotoAlt: '工地照片示範',

    // Demo Page - Image specific content
    demoImage1Name: '工地支撐柱-示範.jpg',
    demoImage2Name: '施工現場-示範.jpg',
    demoAnalysis1: `分析結果:
1. 照片概述：
   - 照片顯示了一根鏽蝕的鋼製支撐杆，旁邊有一些木板和其他建築材料。
2. 安全問題分析：
   - 鋼支撐杆有明顯的鏽蝕，可能影響其結構完整性和承重能力。
   - 鋼材周圍的鋼線用於固定，可能缺乏堅固和牢靠性，加大倒塌和受傷風險。
   - 照片中未能看到工人及其個人防護裝備的使用情況。
3. 衛生問題分析：
   - 支撐杆和周圍建築材料有鏽跡和塵埃，可能意味著未進行適當清理。
   - 照片中無法確定廢棄物處理的情況。
4. 施工品質分析：
   - 鏽蝕的鋼支撐杆表示未妥善維護或使用不適當的材料。
   - 不正確的綁紮方法可能意味著安裝技術不符合標準。
5. 建議改善措施：
   - 定期檢查並維護工地的金屬支撐結構，防止鏽蝕影響安全。
   - 使用適當的固定工具來更換鋼線，以確保支撐杆的穩固性。
   - 確保定期清理施工現場，減少鏽蝕和污染。
   - 提供工人正確的個人防護裝備，並確保其保持良好狀態。
   - 定期培訓工人施工技術，確保符合安全和品質標準。`,
    demoAnalysis2: `從公共安全和台灣工地相關法規的角度來看，這張照片顯示的工地存在以下安全風險：

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

這些問題若不改善，可能違反台灣的職業安全法規，並增加工地意外的風險。`,
    demoAnalysis3: `1. 照片概述：
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
- 實施定期質量檢查和驗收制度，確保符合設計要求`,

    // History Page
    historyPageTitle: '歷史記錄',
    trashBinPageTitle: '回收桶',
    viewTrashBin: '查看回收桶',
    returnToHistory: '返回歷史記錄',
    yourAnalysisHistory: '您的分析歷史記錄',
    trashBinInfo: '回收桶（30天後自動刪除）',
    selectAll: '全選',
    restore: '恢復',
    deletePermanently: '永久刪除',
    deleteAction: '刪除',
    selectBatchNumber: '選擇批次號碼...',
    batchPrefix: '批次: ',
    loading: '載入中...',
    errorPrefix: '錯誤: ',
    unauthorizedMessage: '您需要登入才能查看歷史記錄。',
    loginReturnHome: '返回首頁登入',
    noHistoryItems: '沒有找到歷史記錄。',
    noTrashItems: '回收桶中沒有項目。',
    analysisDatePrefix: '分析日期: ',
    batchNumberPrefix: '批次編號: ',
    viewDetails: '查看詳細內容',
    willBePermanentlyDeletedOn: '將於 {date} 永久刪除',
    previousPage: '上一頁',
    nextPage: '下一頁',
    confirmPermanentDelete: '確定要永久刪除所選項目嗎？此操作無法撤銷。',
    itemsMovedToTrash: '已將所選項目移至回收桶',
    deleteFailed: '刪除失敗: {error}',
    itemsRestored: '已恢復所選項目',
    restoreFailed: '恢復失敗: {error}',
    itemsPermanentlyDeleted: '已永久刪除所選項目',
    permanentDeleteFailed: '永久刪除失敗: {error}',
    errorFetchingHistory: '無法獲取歷史記錄',
    errorDeletingRecord: '無法刪除記錄',
    errorRestoringRecord: '無法恢復記錄',
    errorPermanentlyDeletingRecord: '無法永久刪除記錄',
    analyzedImageAlt: '分析圖片',

    // Homepage Hero Section
    heroTitle: '革命性的工地AI視覺分析師',
    heroSubtitle: '即時洞察，提升安全，優化品質。上傳您的工地照片，體驗前所未有的智能檢測！',
    heroCTA: '立即開始分析',
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
    copyright: '© {year} 工地安全与品质检查 AI - 使用 AI 视觉模型 - 張渝江技師設計',

    // Demo Page Specific
    demoPageTitle: '示范页面 - 工地 AI 检查',
    demoFeatureTitle: '示范功能',
    demoFeatureDescription: '这是一个示范页面，展示多张照片上传和分析功能。',
    demoNote: '注意：这是示范页面，使用的是模拟数据。查看实际的分析历史记录，请访问',
    analyzeAllPhotosDemo: '一键分析所有示范照片',
    analyzeThisPhotoDemo: '分析此示范照片',
    sitePhotoAlt: '工地照片示范',

    // Demo Page - Image specific content
    demoImage1Name: '工地支撑柱-示范.jpg',
    demoImage2Name: '施工现场-示范.jpg',
    demoAnalysis1: `分析结果:
1. 照片概述：
   - 照片显示了一根锈蚀的钢制支撑杆，旁边有一些木板和其他建筑材料。
2. 安全问题分析：
   - 钢支撑杆有明显的锈蚀，可能影响其结构完整性和承重能力。
   - 钢材周围的钢线用于固定，可能缺乏坚固和牢靠性，加大倒塌和受伤风险。
   - 照片中未能看到工人及其个人防护装备的使用情况。
3. 卫生问题分析：
   - 支撑杆和周围建筑材料有锈迹和尘埃，可能意味着未进行适当清理。
   - 照片中无法确定废弃物处理的情况。
4. 施工质量分析：
   - 锈蚀的钢支撑杆表示未妥善维护或使用不适当的材料。
   - 不正确的绑扎方法可能意味着安装技术不符合标准。
5. 建议改善措施：
   - 定期检查并维护工地的金属支撑结构，防止锈蚀影响安全。
   - 使用适当的固定工具来更换钢线，以确保支撑杆的稳固性。
   - 确保定期清理施工现场，减少锈蚀和污染。
   - 提供工人正确的个人防护装备，并确保其保持良好状态。
   - 定期培训工人施工技术，确保符合安全和质量标准。`,
    demoAnalysis2: `从公共安全和中国工地相关法规的角度来看，这张照片显示的工地存在以下安全风险：

1. **高处作业风险**：
   照片显示一个深坑，没有明显的护栏或安全围栏。根据中国《安全生产法》和相关建筑施工安全规范，高处作业（通常指高度超过2米）必须设置防护栏杆、盖板或安全网，防止人员坠落。

2. **地面杂物与绊倒风险**：
   坑底有木板、垃圾和其他杂物，容易造成工人绊倒或滑倒。相关规范要求施工现场应保持整洁，清除散落物以防意外。

3. **结构稳定性问题**：
   混凝土墙上有突出的钢筋，未妥善处理，可能刺伤工人或因结构不稳定导致坍塌风险。法规要求钢筋末端应作弯折处理或加装保护帽。

4. **照明不足**：
   照片中光线昏暗，照明明显不足。施工安全规范要求工地必须提供充足照明，确保工人能清晰辨识环境，避免事故。

5. **缺乏安全警示**：
   未见警示标志或告示牌，提醒工人注意深坑危险。法规要求在危险区域设置明显的安全警示标志。

**建议改善措施**：
- 设置护栏或安全网，防止坠落。
- 清理地面杂物，保持工作区域整洁。
- 处理突出钢筋，确保结构安全。
- 提供充足照明，确保工作环境安全。
- 设置警示标志，提醒工人注意危险。

这些问题若不改善，可能违反中国的安全生产法规，并增加工地意外的风险。`,
    demoAnalysis3: `1. 照片概述：
照片显示一处建筑工地的混凝土浇筑工作，可见新浇筑的混凝土表面和周围的施工环境。工人正在进行表面处理作业。

2. 安全问题分析：
- 工作区域缺乏明确的安全警示标识
- 部分工人未佩戴安全帽或其他必要的防护装备
- 电线和工具散乱放置，存在绊倒和触电风险
- 工作平台边缘缺乏防护栏杆，存在坠落风险

3. 卫生问题分析：
- 工地周围有建筑废料和垃圾未及时清理
- 水泥和混凝土灰尘飞扬，可能影响工人健康和周围环境
- 未见适当的洗手和清洁设施
- 工具和设备未妥善存放，可能导致污染扩散

4. 施工质量分析：
- 混凝土表面处理不均匀，存在凹凸不平现象
- 部分区域有蜂窝麻面现象，可能是振捣不充分导致
- 混凝土与模板接缝处理不当，存在漏浆现象
- 养护措施不足，可能影响混凝土强度发展

5. 建议改善措施：
- 加强工地安全管理，确保所有工人佩戴适当的个人防护装备
- 设置明确的安全警示标识和防护栏杆
- 改进混凝土浇筑和振捣工艺，确保密实度
- 加强混凝土养护工作，避免过早失水和开裂
- 建立工地清洁制度，及时清理废料和垃圾
- 对施工人员进行专业技能培训，提高施工质量意识
- 实施定期质量检查和验收制度，确保符合设计要求`,

    // History Page
    historyPageTitle: '历史记录',
    trashBinPageTitle: '回收桶',
    viewTrashBin: '查看回收桶',
    returnToHistory: '返回历史记录',
    yourAnalysisHistory: '您的分析历史记录',
    trashBinInfo: '回收桶（30天后自动删除）',
    selectAll: '全选',
    restore: '恢复',
    deletePermanently: '永久删除',
    deleteAction: '删除',
    selectBatchNumber: '选择批次编号...',
    batchPrefix: '批次: ',
    loading: '加载中...',
    errorPrefix: '错误: ',
    unauthorizedMessage: '您需要登录才能查看历史记录。',
    loginReturnHome: '返回首页登录',
    noHistoryItems: '没有找到历史记录。',
    noTrashItems: '回收桶中没有项目。',
    analysisDatePrefix: '分析日期: ',
    batchNumberPrefix: '批次编号: ',
    viewDetails: '查看详细内容',
    willBePermanentlyDeletedOn: '将于 {date} 永久删除',
    previousPage: '上一页',
    nextPage: '下一页',
    confirmPermanentDelete: '确定要永久删除所选项目吗？此操作无法撤销。',
    itemsMovedToTrash: '已将所选项目移至回收桶',
    deleteFailed: '删除失败: {error}',
    itemsRestored: '已恢复所选项目',
    restoreFailed: '恢复失败: {error}',
    itemsPermanentlyDeleted: '已永久删除所选项目',
    permanentDeleteFailed: '永久删除失败: {error}',
    errorFetchingHistory: '无法获取历史记录',
    errorDeletingRecord: '无法删除记录',
    errorRestoringRecord: '无法恢复记录',
    errorPermanentlyDeletingRecord: '无法永久删除记录',
    analyzedImageAlt: '分析图片',

    // Homepage Hero Section
    heroTitle: '革命性的工地AI视觉分析师',
    heroSubtitle: '即时洞察，提升安全，优化品质。上传您的工地照片，体验前所未有的智能检测！',
    heroCTA: '立即开始分析',
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
    copyright: '© {year} Construction Site Safety & Quality Inspection AI - Using AI Vision Models - Design by Yu Jiang Chang, PE',

    // Demo Page Specific
    demoPageTitle: 'Demo Page - Site AI Inspection',
    demoFeatureTitle: 'Demo Feature',
    demoFeatureDescription: 'This is a demo page showcasing multi-photo upload and analysis functionality.',
    demoNote: 'Note: This is a demo page using mock data. To view actual analysis history, please visit the',
    analyzeAllPhotosDemo: 'Analyze All Demo Photos',
    analyzeThisPhotoDemo: 'Analyze This Demo Photo',
    sitePhotoAlt: 'Site Photo Demo',

    // Demo Page - Image specific content
    demoImage1Name: 'SupportPillar-Demo.jpg',
    demoImage2Name: 'ConstructionSite-Demo.jpg',
    demoAnalysis1: `Analysis Results:
1. Photo Overview:
   - The photo shows a rusted steel support pole, with some wooden planks and other construction materials nearby.
2. Safety Issues Analysis:
   - The steel support pole shows significant rust, which may affect its structural integrity and load-bearing capacity.
   - Steel wires around the steel are used for securing, which may lack sturdiness and reliability, increasing the risk of collapse and injury.
   - The photo does not show workers or the use of personal protective equipment.
3. Hygiene Issues Analysis:
   - The support pole and surrounding construction materials have rust stains and dust, possibly indicating inadequate cleaning.
   - The photo does not allow for determination of waste disposal conditions.
4. Construction Quality Analysis:
   - The rusted steel support pole suggests improper maintenance or use of unsuitable materials.
   - Incorrect binding methods may indicate that installation techniques do not meet standards.
5. Recommended Improvement Measures:
   - Regularly inspect and maintain metal support structures on the site to prevent rust from affecting safety.
   - Use appropriate securing tools to replace steel wires, ensuring the stability of the support pole.
   - Ensure regular cleaning of the construction site to reduce rust and contamination.
   - Provide workers with proper personal protective equipment and ensure it remains in good condition.
   - Conduct regular training for workers on construction techniques to ensure compliance with safety and quality standards.`,
    demoAnalysis2: `This image also depicts several common construction site hazards:

1.  **Fall Hazards**: Similar to the first image, an unguarded edge or opening suggests a risk of falls.
2.  **Debris and Poor Housekeeping**: Scattered materials can lead to trips and slips.
3.  **Improper Material Storage**: Materials should be stored in a stable and organized manner.
4.  **Potential for Falling Objects**: If work is occurring above, there's a risk of objects falling into the lower area.
5.  **Access and Egress**: Safe means of entering and exiting work areas must be provided.

**Recommendations**:
- Secure all edges with guardrails.
- Maintain clear pathways and remove debris.
- Store materials safely.
- Use toe boards and netting if overhead work is ongoing.
- Ensure safe access points.`,
    demoAnalysis3: `1. Photo Overview:
The photo shows concrete pouring work at a construction site, with a newly poured concrete surface and the surrounding construction environment. Workers are engaged in surface finishing.

2. Safety Issues Analysis:
- Lack of clear safety warning signs in the work area.
- Some workers are not wearing safety helmets or other necessary protective gear.
- Wires and tools are scattered, posing tripping and electric shock risks.
- Lack of guardrails on the edges of work platforms, posing fall risks.

3. Hygiene Issues Analysis:
- Construction waste and debris around the site are not cleaned up in a timely manner.
- Cement and concrete dust may affect workers' health and the surrounding environment.
- No adequate handwashing and cleaning facilities are visible.
- Tools and equipment are not properly stored, potentially leading to contamination.

4. Construction Quality Analysis:
- Uneven concrete surface finishing, with bumps and depressions.
- Honeycombing in some areas, possibly due to insufficient vibration.
- Improper handling of joints between concrete and formwork, leading to slurry leakage.
- Insufficient curing measures, which may affect concrete strength development.

5. Recommended Improvement Measures:
- Strengthen site safety management, ensuring all workers wear appropriate PPE.
- Install clear safety warning signs and guardrails.
- Improve concrete pouring and vibration processes to ensure density.
- Enhance concrete curing to prevent premature drying and cracking.
- Establish a site cleaning system for timely removal of waste and debris.
- Provide professional skills training for construction personnel to improve quality awareness.
- Implement regular quality inspections and acceptance systems to ensure compliance with design requirements.`,
    
    // History Page
    historyPageTitle: 'History',
    trashBinPageTitle: 'Trash Bin',
    viewTrashBin: 'View Trash Bin',
    returnToHistory: 'Return to History',
    yourAnalysisHistory: 'Your Analysis History',
    trashBinInfo: 'Trash Bin (auto-deleted after 30 days)',
    selectAll: 'Select All',
    restore: 'Restore',
    deletePermanently: 'Delete Permanently',
    deleteAction: 'Delete',
    selectBatchNumber: 'Select Batch Number...',
    batchPrefix: 'Batch: ',
    loading: 'Loading...',
    errorPrefix: 'Error: ',
    unauthorizedMessage: 'You need to log in to view history.',
    loginReturnHome: 'Return to Homepage to Login',
    noHistoryItems: 'No history items found.',
    noTrashItems: 'No items in the trash bin.',
    analysisDatePrefix: 'Analysis Date: ',
    batchNumberPrefix: 'Batch No.: ',
    viewDetails: 'View Details',
    willBePermanentlyDeletedOn: 'Will be permanently deleted on {date}',
    previousPage: 'Previous',
    nextPage: 'Next',
    confirmPermanentDelete: 'Are you sure you want to permanently delete the selected items? This action cannot be undone.',
    itemsMovedToTrash: 'Selected items moved to trash.',
    deleteFailed: 'Delete failed: {error}',
    itemsRestored: 'Selected items restored.',
    restoreFailed: 'Restore failed: {error}',
    itemsPermanentlyDeleted: 'Selected items permanently deleted.',
    permanentDeleteFailed: 'Permanent delete failed: {error}',
    errorFetchingHistory: 'Failed to fetch history',
    errorDeletingRecord: 'Failed to delete record(s)',
    errorRestoringRecord: 'Failed to restore record(s)',
    errorPermanentlyDeletingRecord: 'Failed to permanently delete record(s)',
    analyzedImageAlt: 'Analyzed Image',

    // Homepage Hero Section
    heroTitle: 'Revolutionary Construction Site AI Vision Analyst',
    heroSubtitle: 'Instant insights, enhanced safety, optimized quality. Upload your site photos and experience unprecedented intelligent inspection!',
    heroCTA: 'Start Analyzing Now',
  },
  'de': {
    // Common
    appName: 'KI für Baustellensicherheit & Qualitätsprüfung',
    appDescription: 'Nutzen Sie KI-Visionmodelle zur Analyse von Baustellenfotos, Überprüfung von Sicherheitsproblemen, Baumängeln oder Fehlern',
    
    // Navigation
    demo: 'Demo ansehen',
    history: 'Verlauf',
    login: 'Anmelden',
    
    // Main page
    uploadPhotos: 'Baustellenfotos hochladen',
    analyzeAllPhotos: 'Alle Fotos analysieren',
    analyzing: 'Analysiere...',
    analyzeThisPhoto: 'Dieses Foto analysieren',
    fileName: 'Dateiname',
    photo: 'Foto',
    analysisResult: 'Analyseergebnis',
    loginToSave: 'Zum Speichern der Analyseergebnisse anmelden',
    copyResult: 'Ergebnis kopieren',
    resultCopied: 'Analyseergebnis in die Zwischenablage kopiert',
    
    // Errors
    uploadFirst: 'Bitte laden Sie zuerst Baustellenfotos hoch',
    analysisError: 'Fehler bei der Fotoanalyse',
    
    // Footer
    copyright: '© {year} KI für Baustellensicherheit & Qualitätsprüfung - KI-Visionmodelle verwenden - by Yu Jiang Chang, PE',

    // Demo Page Specific
    demoPageTitle: 'Demo-Seite - Baustellen-KI-Prüfung',
    demoFeatureTitle: 'Demo-Funktion',
    demoFeatureDescription: 'Dies ist eine Demo-Seite, die das Hochladen mehrerer Fotos und die Analysefunktionen zeigt.',
    demoNote: 'Hinweis: Dies ist eine Demo-Seite mit Modelldaten. Um den tatsächlichen Analyse-Verlauf anzuzeigen, besuchen Sie bitte die Seite',
    analyzeAllPhotosDemo: 'Alle Demo-Fotos analysieren',
    analyzeThisPhotoDemo: 'Dieses Demo-Foto analysieren',
    sitePhotoAlt: 'Baustellenfoto-Demo',

    // Demo Page - Image specific content
    demoImage1Name: 'Stützpfeiler-Demo.jpg',
    demoImage2Name: 'Baustelle-Demo.jpg',
    demoAnalysis1: `Analyseergebnisse:
1. Fotoübersicht:
   - Das Foto zeigt einen verrosteten Stahlstützpfahl, daneben einige Holzbretter und andere Baumaterialien.
2. Sicherheitsmängelanalyse:
   - Der Stahlstützpfahl zeigt erheblichen Rost, der die strukturelle Integrität und Tragfähigkeit beeinträchtigen könnte.
   - Stahldrähte um den Stahl dienen der Sicherung, könnten jedoch an Stabilität und Zuverlässigkeit mangeln, was das Risiko von Einsturz und Verletzungen erhöht.
   - Auf dem Foto sind keine Arbeiter oder die Verwendung persönlicher Schutzausrüstung zu sehen.
3. Hygienemängelanalyse:
   - Der Stützpfahl und die umliegenden Baumaterialien weisen Rostflecken und Staub auf, was möglicherweise auf unzureichende Reinigung hinweist.
   - Das Foto erlaubt keine Bestimmung der Entsorgungsbedingungen für Abfälle.
4. Bauqualitätsanalyse:
   - Der verrostete Stahlstützpfahl deutet auf unsachgemäße Wartung oder die Verwendung ungeeigneter Materialien hin.
   - Falsche Bindemethoden könnten darauf hindeuten, dass die Installationstechniken nicht den Standards entsprechen.
5. Empfohlene Verbesserungsmaßnahmen:
   - Regelmäßige Inspektion und Wartung der Metallstützstrukturen auf der Baustelle, um Rost zu verhindern, der die Sicherheit beeinträchtigt.
   - Verwendung geeigneter Sicherungswerkzeuge, um Stahldrähte zu ersetzen und die Stabilität des Stützpfahls zu gewährleisten.
   - Sicherstellen einer regelmäßigen Reinigung der Baustelle, um Rost und Verschmutzung zu reduzieren.
   - Bereitstellung der richtigen persönlichen Schutzausrüstung für Arbeiter und Sicherstellung, dass diese in gutem Zustand bleibt.
   - Regelmäßige Schulung der Arbeiter in Bautechniken, um die Einhaltung von Sicherheits- und Qualitätsstandards zu gewährleisten.`,
    demoAnalysis2: `(Deutsche Übersetzung der Analyse 2) Dieses Bild zeigt ebenfalls häufige Gefahren auf Baustellen:

1.  **Absturzgefahren**: Ähnlich wie im ersten Bild deutet eine ungesicherte Kante auf Absturzrisiken hin.
2.  **Schutt und mangelnde Ordnung**: Verstreute Materialien können zu Stolpern und Ausrutschen führen.
3.  **Unsachgemäße Materiallagerung**.
4.  **Potenzial für herabfallende Gegenstände**.
5.  **Zugang und Fluchtwege**.

**Empfehlungen**:
- Kanten sichern.
- Wege freihalten.
- Materialien sicher lagern.
- Fußleisten und Netze verwenden.
- Sichere Zugänge gewährleisten.`,
    demoAnalysis3: `(Deutsche Übersetzung der Analyse 3) 1. Fotoübersicht:
Das Foto zeigt Betonierarbeiten auf einer Baustelle.

2. Sicherheitsmängelanalyse:
- Fehlende Sicherheitswarnzeichen.
- Einige Arbeiter tragen keine Schutzhelme.
- Unordnung durch Kabel und Werkzeuge.
- Fehlende Geländer an Arbeitsbühnen.

3. Hygienemängelanalyse:
- Bauabfälle nicht rechtzeitig beseitigt.
- Staubentwicklung.
- Fehlende Reinigungsmöglichkeiten.

4. Bauqualitätsanalyse:
- Unebene Betonoberfläche.
- Kiesnester sichtbar.
- Undichte Schalungsfugen.
- Unzureichende Nachbehandlung.

5. Empfohlene Verbesserungsmaßnahmen:
- Sicherheitsmanagement verstärken.
- Warnzeichen und Geländer anbringen.
- Betonier- und Verdichtungsprozesse verbessern.
- Nachbehandlung des Betons intensivieren.
- Baustellenreinigung etablieren.
- Fachschulungen durchführen.
- Qualitätskontrollen implementieren.`,

    // History Page
    historyPageTitle: 'Verlauf',
    trashBinPageTitle: 'Papierkorb',
    viewTrashBin: 'Papierkorb ansehen',
    returnToHistory: 'Zurück zum Verlauf',
    yourAnalysisHistory: 'Ihr Analyse-Verlauf',
    trashBinInfo: 'Papierkorb (automatische Löschung nach 30 Tagen)',
    selectAll: 'Alle auswählen',
    restore: 'Wiederherstellen',
    deletePermanently: 'Endgültig löschen',
    deleteAction: 'Löschen',
    selectBatchNumber: 'Chargennummer auswählen...',
    batchPrefix: 'Charge: ',
    loading: 'Lädt...',
    errorPrefix: 'Fehler: ',
    unauthorizedMessage: 'Sie müssen angemeldet sein, um den Verlauf anzuzeigen.',
    loginReturnHome: 'Zur Startseite zum Anmelden',
    noHistoryItems: 'Keine Verlaufsdaten gefunden.',
    noTrashItems: 'Keine Elemente im Papierkorb.',
    analysisDatePrefix: 'Analysedatum: ',
    batchNumberPrefix: 'Chargennr.: ',
    viewDetails: 'Details anzeigen',
    willBePermanentlyDeletedOn: 'Wird am {date} endgültig gelöscht',
    previousPage: 'Zurück',
    nextPage: 'Weiter',
    confirmPermanentDelete: 'Möchten Sie die ausgewählten Elemente wirklich endgültig löschen? Diese Aktion kann nicht rückgängig gemacht werden.',
    itemsMovedToTrash: 'Ausgewählte Elemente in den Papierkorb verschoben.',
    deleteFailed: 'Löschen fehlgeschlagen: {error}',
    itemsRestored: 'Ausgewählte Elemente wiederhergestellt.',
    restoreFailed: 'Wiederherstellen fehlgeschlagen: {error}',
    itemsPermanentlyDeleted: 'Ausgewählte Elemente endgültig gelöscht.',
    permanentDeleteFailed: 'Endgültiges Löschen fehlgeschlagen: {error}',
    errorFetchingHistory: 'Verlauf konnte nicht abgerufen werden',
    errorDeletingRecord: 'Einträge konnten nicht gelöscht werden',
    errorRestoringRecord: 'Einträge konnten nicht wiederhergestellt werden',
    errorPermanentlyDeletingRecord: 'Einträge konnten nicht endgültig gelöscht werden',
    analyzedImageAlt: 'Analysiertes Bild',

    // Homepage Hero Section
    heroTitle: 'Revolutionärer KI-Visionsanalyst für Baustellen',
    heroSubtitle: 'Sofortige Einblicke, erhöhte Sicherheit, optimierte Qualität. Laden Sie Ihre Baustellenfotos hoch und erleben Sie eine beispiellose intelligente Inspektion!',
    heroCTA: 'Jetzt analysieren',
  },
};
