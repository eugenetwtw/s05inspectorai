import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAnalysisById } from '../../../../lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get user information from Clerk
  const authData = await auth();
  const userId = authData.userId;
  
  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get analysis ID from the URL
    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: '未提供分析ID' }, { status: 400 });
    }
    
    // Get the analysis
    const analysis = await getAnalysisById(id, userId);
    
    if (!analysis) {
      return NextResponse.json({ error: '找不到分析記錄' }, { status: 404 });
    }
    
    // Return the analysis
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json({
      error: '獲取分析記錄時發生錯誤',
      details: error.message,
    }, { status: 500 });
  }
}
