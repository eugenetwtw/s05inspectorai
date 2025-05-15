import { NextRequest, NextResponse } from 'next/server';
import { cleanupOldTrashItems } from '../../../lib/db';

// This endpoint should be protected in production
// For example, by using a secret key or restricting access to specific IPs
export async function POST(request: NextRequest) {
  try {
    // Check for authorization (in a real app, you'd use a more secure method)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CLEANUP_SECRET_TOKEN;
    
    // If a token is set in the environment, validate it
    if (expectedToken && (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.slice(7) !== expectedToken)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Run the cleanup
    await cleanupOldTrashItems();
    
    // Return success
    return NextResponse.json({ 
      success: true,
      message: '已清理超過30天的回收桶項目',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error cleaning up old trash items:', error);
    return NextResponse.json({
      error: '清理舊回收桶項目時發生錯誤',
      details: error.message,
    }, { status: 500 });
  }
}
