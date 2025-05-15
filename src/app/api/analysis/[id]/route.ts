import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getAnalysisById, sql } from '../../../../lib';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get user information from Clerk
  const authData = await auth();
  const userId = authData.userId;
  
  console.log('Fetching analysis by ID:', params.id, 'for user:', userId);
  
  // Check if user is authenticated
  if (!userId) {
    console.error('Unauthorized access attempt to analysis ID:', params.id);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get analysis ID from the URL
    const id = params.id;
    
    if (!id) {
      console.error('No analysis ID provided in request');
      return NextResponse.json({ error: '未提供分析ID' }, { status: 400 });
    }
    
    // Check if we should include deleted items
    const searchParams = request.nextUrl.searchParams;
    const includeDeleted = searchParams.get('includeDeleted') === 'true';
    console.log('Include deleted items:', includeDeleted);
    
    // Get the analysis
    console.log('Calling getAnalysisById with params:', { id, userId, includeDeleted });
    const analysis = await getAnalysisById(id, userId, includeDeleted);
    
    if (!analysis) {
      console.error('Analysis record not found for ID:', id, 'and user:', userId);
      return NextResponse.json({ error: '找不到分析記錄' }, { status: 404 });
    }
    
    console.log('Analysis record found:', analysis.id);
    
    // Return the analysis as 'record' to match frontend expectations
    return NextResponse.json({ record: analysis });
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return NextResponse.json({
      error: '獲取分析記錄時發生錯誤',
      details: error.message,
    }, { status: 500 });
  }
}
