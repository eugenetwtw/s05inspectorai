import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserAnalysisHistory } from '../../../lib/db';

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
    
    // Get user's analysis history
    const history = await getUserAnalysisHistory(userId, limit, offset);
    
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
