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
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return NextResponse.json({ 
        error: '無效的請求格式',
        details: 'Request body is not valid JSON'
      }, { status: 400 });
    }
    
    const { ids } = body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ 
        error: '無效的請求參數',
        details: 'ids parameter must be a non-empty array'
      }, { status: 400 });
    }
    
    console.log('Restoring items from trash:', ids);
    
    // Process each ID individually to avoid errors
    for (const id of ids) {
      try {
        // Convert id to number if it's a string
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        
        if (isNaN(numericId)) {
          console.error(`Invalid ID format: ${id}`);
          continue;
        }
        
        // Restore the analysis from trash
        await restoreAnalysesFromTrash([numericId], userId);
      } catch (idError) {
        console.error(`Error processing ID ${id}:`, idError);
        // Continue with other IDs even if one fails
      }
    }
    
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
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('Error parsing request body:', e);
      return NextResponse.json({ 
        error: '無效的請求格式',
        details: 'Request body is not valid JSON'
      }, { status: 400 });
    }
    
    const { ids } = body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ 
        error: '無效的請求參數',
        details: 'ids parameter must be a non-empty array'
      }, { status: 400 });
    }
    
    console.log('Permanently deleting items:', ids);
    
    // Convert all IDs to numbers
    const numericIds = ids.map(id => typeof id === 'string' ? parseInt(id, 10) : id)
                          .filter(id => !isNaN(id));
    
    if (numericIds.length === 0) {
      return NextResponse.json({ 
        error: '無效的請求參數',
        details: 'No valid numeric IDs provided'
      }, { status: 400 });
    }
    
    // Permanently delete all analyses at once
    await permanentlyDeleteAnalyses(numericIds, userId);
    
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
