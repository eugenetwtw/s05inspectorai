import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { getUserAnalysisHistory, moveAnalysesToTrash, upsertUser } from '../../../lib';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    error: '歷史記錄功能已停用',
    details: '此功能目前不可用。'
  }, { status: 503 });
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({
    error: '歷史記錄功能已停用',
    details: '此功能目前不可用。'
  }, { status: 503 });
}
