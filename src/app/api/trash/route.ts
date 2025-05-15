import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { 
  getUserAnalysisHistory, 
  restoreAnalysesFromTrash, 
  permanentlyDeleteAnalyses,
  cleanupOldTrashItems
} from '../../../lib/db';

// Get trash items
export async function GET(request: NextRequest) {
  // Get user information from Clerk
  const authData = await auth();
  const userId = authData.userId;
  
  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse pagination parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Get user's trash items (deleted = true)
    const trashItems = await getUserAnalysisHistory(userId, limit, offset, true);
    
    // Return the trash items
    return NextResponse.json({ trashItems });
  } catch (error) {
    console.error('Error fetching trash items:', error);
    return NextResponse.json({
      error: '獲取回收桶記錄時發生錯誤',
      details: error.message,
    }, { status: 500 });
  }
}

// Restore items from trash
export async function PUT(request: NextRequest) {
  // Get user information from Clerk
  const authData = await auth();
  const userId = authData.userId;
  
  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the IDs to restore from the request body
    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '無效的請求參數' }, { status: 400 });
    }
    
    // Restore the analyses from trash
    await restoreAnalysesFromTrash(ids, userId);
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error restoring analyses from trash:', error);
    return NextResponse.json({
      error: '恢復記錄時發生錯誤',
      details: error.message,
    }, { status: 500 });
  }
}

// Permanently delete items from trash
export async function DELETE(request: NextRequest) {
  // Get user information from Clerk
  const authData = await auth();
  const userId = authData.userId;
  
  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the IDs to delete from the request body
    const { ids } = await request.json();
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '無效的請求參數' }, { status: 400 });
    }
    
    // Permanently delete the analyses
    await permanentlyDeleteAnalyses(ids, userId);
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error permanently deleting analyses:', error);
    return NextResponse.json({
      error: '永久刪除記錄時發生錯誤',
      details: error.message,
    }, { status: 500 });
  }
}

// Cleanup old trash items (for scheduled jobs)
export async function POST(request: NextRequest) {
  try {
    // This endpoint could be protected with a secret key for scheduled jobs
    // For now, we'll just run the cleanup
    await cleanupOldTrashItems();
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error cleaning up old trash items:', error);
    return NextResponse.json({
      error: '清理舊回收桶項目時發生錯誤',
      details: error.message,
    }, { status: 500 });
  }
}
