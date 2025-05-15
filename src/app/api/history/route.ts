import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserAnalysisHistory, moveAnalysesToTrash } from '../../../lib/db';

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
    const showDeleted = searchParams.get('showDeleted') === 'true';
    
    // Get user's analysis history
    const history = await getUserAnalysisHistory(userId, limit, offset, showDeleted);
    
    // Return the history
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    return NextResponse.json({
      error: '獲取歷史記錄時發生錯誤',
      details: error.message,
    }, { status: 500 });
  }
}

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
    
    console.log('Moving items to trash:', ids);
    
    // Process each ID individually to avoid errors
    for (const id of ids) {
      try {
        // Convert id to number if it's a string
        const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
        
        if (isNaN(numericId)) {
          console.error(`Invalid ID format: ${id}`);
          continue;
        }
        
        // Move the analysis to trash
        await moveAnalysesToTrash([numericId], userId);
      } catch (idError) {
        console.error(`Error processing ID ${id}:`, idError);
        // Continue with other IDs even if one fails
      }
    }
    
    // Return success
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error moving analyses to trash:', error);
    return NextResponse.json({
      error: '刪除記錄時發生錯誤',
      details: error.message,
    }, { status: 500 });
  }
}
