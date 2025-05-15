import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '../../../lib';

export async function POST(request: NextRequest) {
  try {
    const success = await initializeDatabase();
    
    if (success) {
      return NextResponse.json({ message: 'Database initialized successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to initialize database' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in init-db API:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize database',
      details: error.message
    }, { status: 500 });
  }
}
