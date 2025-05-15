import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../lib';

// This endpoint should be protected in production
// For example, by using a secret key or restricting access to specific IPs
export async function POST(request: NextRequest) {
  return NextResponse.json({
    error: '回收桶清理功能已停用',
    details: '此功能目前不可用。'
  }, { status: 503 });
}
