import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { 
  getUserAnalysisHistory, 
  restoreAnalysesFromTrash, 
  executePermanentDeletion,
  cleanupOldTrashItems,
  upsertUser,
  sql
} from '../../../lib';

// Get trash items
export async function GET(request: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData.userId;

    console.log('Fetching trash items for user:', userId);

    if (!userId) {
      console.error('Unauthorized access attempt to trash API');
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);

    console.log('Trash request params:', { limit, offset });

    // Use the same function as history but with showDeleted=true
    console.log('Calling getUserAnalysisHistory with params:', { userId, limit, offset, showDeleted: true });
    const history = await getUserAnalysisHistory(userId, limit, offset, true);
    console.log(`Retrieved ${history.length} trash records for user:`, userId);

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching trash items:', error);
    return NextResponse.json({ error: '無法獲取回收桶項目', details: error.message }, { status: 500 });
  }
}

// Restore items from trash
export async function PUT(request: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData.userId;

    if (!userId) {
      console.error('Unauthorized access attempt to restore trash items');
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    console.log('Restore request for IDs:', ids, 'from user:', userId);

    if (!Array.isArray(ids) || ids.length === 0) {
      console.error('Invalid record IDs provided for restoration:', ids);
      return NextResponse.json({ error: '未提供有效的記錄ID' }, { status: 400 });
    }

    console.log('Calling restoreAnalysesFromTrash with params:', { ids, userId });
    const success = await restoreAnalysesFromTrash(ids, userId);
    
    if (success) {
      console.log('Successfully restored records from trash:', ids);
      return NextResponse.json({ message: '記錄已從回收桶恢復' });
    } else {
      console.error('Failed to restore records from trash:', ids);
      return NextResponse.json({ error: '無法從回收桶恢復記錄' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error restoring records from trash:', error);
    return NextResponse.json({ error: '無法恢復記錄', details: error.message }, { status: 500 });
  }
}

// Permanently delete items from trash
export async function DELETE(request: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData.userId;

    if (!userId) {
      console.error('Unauthorized access attempt to permanently delete trash items');
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    console.log('Permanent delete request for IDs:', ids, 'from user:', userId);

    if (!Array.isArray(ids) || ids.length === 0) {
      console.error('Invalid record IDs provided for permanent deletion:', ids);
      return NextResponse.json({ error: '未提供有效的記錄ID' }, { status: 400 });
    }

    console.log('Calling executePermanentDeletion with params:', { ids, userId });
    const success = await executePermanentDeletion(ids, userId);
    
    if (success) {
      console.log('Successfully permanently deleted records:', ids);
      return NextResponse.json({ message: '記錄已永久刪除' });
    } else {
      console.error('Failed to permanently delete records:', ids);
      return NextResponse.json({ error: '無法永久刪除記錄' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error permanently deleting records:', error);
    return NextResponse.json({ error: '無法永久刪除記錄', details: error.message }, { status: 500 });
  }
}

// Cleanup old trash items (for scheduled jobs)
export async function POST(request: NextRequest) {
  try {
    // This endpoint should be protected in production
    // For example, by using a secret key or restricting access to specific IPs
    
    console.log('Starting cleanup of old trash items');
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
    return NextResponse.json({ error: '無法清理舊的回收桶項目', details: error.message }, { status: 500 });
  }
}
