import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getUserAnalysisHistory, moveAnalysesToTrash } from '../../../lib';

export async function GET(request: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData.userId;

    if (!userId) {
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    const offset = parseInt(url.searchParams.get('offset') || '0', 10);
    const showDeleted = url.searchParams.get('showDeleted') === 'true';

    const history = await getUserAnalysisHistory(userId, limit, offset, showDeleted);
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json({ error: '無法獲取歷史記錄', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authData = await auth();
    const userId = authData.userId;

    if (!userId) {
      return NextResponse.json({ error: '未授權訪問' }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: '未提供有效的記錄ID' }, { status: 400 });
    }

    const success = await moveAnalysesToTrash(ids, userId);
    if (success) {
      return NextResponse.json({ message: '記錄已移至垃圾桶' });
    } else {
      return NextResponse.json({ error: '無法將記錄移至垃圾桶' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error deleting history records:', error);
    return NextResponse.json({ error: '無法刪除歷史記錄', details: error.message }, { status: 500 });
  }
}
