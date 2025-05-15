import { NextRequest, NextResponse } from 'next/server';
import { cleanupOldTrashItems } from '../../../lib';

// This endpoint should be protected in production
// For example, by using a secret key or restricting access to specific IPs
export async function POST(request: NextRequest) {
  try {
    // In a production environment, you would add authentication here
    // For example, checking for a secret API key in the request headers
    
    console.log('Starting scheduled cleanup of old trash items');
    const success = await cleanupOldTrashItems();
    
    if (success) {
      console.log('Successfully cleaned up old trash items');
      return NextResponse.json({ message: '已清理舊的回收桶項目' });
    } else {
      console.error('Failed to clean up old trash items');
      return NextResponse.json({ error: '無法清理舊的回收桶項目' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error cleaning up old trash items:', error);
    return NextResponse.json({ 
      error: '清理舊的回收桶項目時發生錯誤',
      details: error.message
    }, { status: 500 });
  }
}
