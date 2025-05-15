import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { upsertUser, sql } from '../../../lib';

export async function POST() {
  // Get user information from Clerk
  const authData = await auth();
  const userId = authData.userId;
  
  // Check if user is authenticated
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the full user data from Clerk
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress || '';
    
    if (!email) {
      console.error('No email found for user:', userId);
      return NextResponse.json({ error: 'User email not found' }, { status: 400 });
    }
    
    console.log('Attempting to sync user data to Supabase for user ID:', userId, 'with email:', email);
    // Upsert user to the database
    await upsertUser(userId, email);
    console.log('User data successfully synced to Supabase for user ID:', userId);
    
    return NextResponse.json({ success: true, message: 'User synchronized successfully' });
  } catch (error) {
    console.error('Error synchronizing user:', error);
    return NextResponse.json({
      error: 'Error synchronizing user',
      details: error.message || String(error),
    }, { status: 500 });
  }
}
