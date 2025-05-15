import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { 
  getUserAnalysisHistory, 
  restoreAnalysesFromTrash, 
  executePermanentDeletion, // Use the new function
  // permanentlyDeleteAnalyses, // Comment out or remove old one
  cleanupOldTrashItems,
  upsertUser,
  sql
} from '../../../lib';

// Get trash items
export async function GET(request: NextRequest) {
  return NextResponse.json({
    error: '回收桶功能已停用',
    details: '此功能目前不可用。'
  }, { status: 503 });
}

// Restore items from trash
export async function PUT(request: NextRequest) {
  return NextResponse.json({
    error: '回收桶功能已停用',
    details: '此功能目前不可用。'
  }, { status: 503 });
}

// Permanently delete items from trash
export async function DELETE(request: NextRequest) {
  return NextResponse.json({
    error: '回收桶功能已停用',
    details: '此功能目前不可用。'
  }, { status: 503 });
}

// Cleanup old trash items (for scheduled jobs)
export async function POST(request: NextRequest) {
  return NextResponse.json({
    error: '回收桶功能已停用',
    details: '此功能目前不可用。'
  }, { status: 503 });
}
