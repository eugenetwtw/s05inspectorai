import { neon } from '@neondatabase/serverless';

// Define types for our database entities
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface AnalysisHistory {
  id: number;
  user_id: string;
  image_url: string;
  analysis_text: string;
  created_at: string;
  deleted: boolean;
  deleted_at: string | null;
  metadata: any;
}

// Initialize the neon client with the connection string
const sql = neon(process.env.DATABASE_URL || '');

// Function to initialize the database schema
export async function initializeDatabase(): Promise<boolean> {
  try {
    // Create users table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create analysis_history table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS analysis_history (
        id SERIAL PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        analysis_text TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        deleted BOOLEAN DEFAULT FALSE,
        deleted_at TIMESTAMP WITH TIME ZONE,
        metadata JSONB
      )
    `;

    // Add deleted and deleted_at columns if they don't exist
    try {
      await sql`
        ALTER TABLE analysis_history 
        ADD COLUMN IF NOT EXISTS deleted BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE
      `;
    } catch (error) {
      console.error('Error adding columns to analysis_history:', error);
    }

    console.log('Database schema initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database schema:', error);
    return false;
  }
}

// Function to create or update a user
export async function upsertUser(userId: string, email: string): Promise<any> {
  try {
    const result = await sql`
      INSERT INTO users (id, email)
      VALUES (${userId}, ${email})
      ON CONFLICT (id) DO UPDATE
      SET email = ${email}
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error upserting user:', error);
    throw error;
  }
}

// Function to save analysis history
export async function saveAnalysisHistory(
  userId: string, 
  imageUrl: string, 
  analysisText: string, 
  metadata: any = {}
): Promise<any> {
  try {
    const result = await sql`
      INSERT INTO analysis_history (user_id, image_url, analysis_text, metadata)
      VALUES (${userId}, ${imageUrl}, ${analysisText}, ${JSON.stringify(metadata)})
      RETURNING *
    `;
    return result[0];
  } catch (error) {
    console.error('Error saving analysis history:', error);
    throw error;
  }
}

// Function to get user's analysis history
export async function getUserAnalysisHistory(
  userId: string, 
  limit: number = 10, 
  offset: number = 0,
  showDeleted: boolean = false
): Promise<any[]> {
  try {
    const result = await sql`
      SELECT * FROM analysis_history
      WHERE user_id = ${userId}
      AND deleted = ${showDeleted}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    return result;
  } catch (error) {
    console.error('Error getting user analysis history:', error);
    throw error;
  }
}

// Function to get a specific analysis by ID
export async function getAnalysisById(
  id: string | number, 
  userId: string,
  includeDeleted: boolean = false
): Promise<any | null> {
  try {
    const query = includeDeleted 
      ? sql`SELECT * FROM analysis_history WHERE id = ${id} AND user_id = ${userId}`
      : sql`SELECT * FROM analysis_history WHERE id = ${id} AND user_id = ${userId} AND deleted = false`;
    
    const result = await query;
    return result[0] || null;
  } catch (error) {
    console.error('Error getting analysis by ID:', error);
    throw error;
  }
}

// Function to mark analyses as deleted (move to trash)
export async function moveAnalysesToTrash(
  ids: number[], 
  userId: string
): Promise<boolean> {
  try {
    const now = new Date();
    
    // Process each ID individually to avoid array conversion issues
    for (const id of ids) {
      await sql`
        UPDATE analysis_history
        SET deleted = true, deleted_at = ${now}
        WHERE id = ${id} AND user_id = ${userId}
      `;
    }
    
    return true;
  } catch (error) {
    console.error('Error moving analyses to trash:', error);
    throw error;
  }
}

// Function to restore analyses from trash
export async function restoreAnalysesFromTrash(
  ids: number[], 
  userId: string
): Promise<boolean> {
  try {
    // Process each ID individually to avoid array conversion issues
    for (const id of ids) {
      await sql`
        UPDATE analysis_history
        SET deleted = false, deleted_at = null
        WHERE id = ${id} AND user_id = ${userId}
      `;
    }
    
    return true;
  } catch (error) {
    console.error('Error restoring analyses from trash:', error);
    throw error;
  }
}

// Function to permanently delete analyses
export async function permanentlyDeleteAnalyses(
  ids: number[], 
  userId: string
): Promise<boolean> {
  try {
    // Process each ID individually to avoid array conversion issues
    for (const id of ids) {
      await sql`
        DELETE FROM analysis_history
        WHERE id = ${id} AND user_id = ${userId}
      `;
    }
    
    return true;
  } catch (error) {
    console.error('Error permanently deleting analyses:', error);
    throw error;
  }
}

// Function to clean up old trash items (older than 30 days)
export async function cleanupOldTrashItems(): Promise<boolean> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    await sql`
      DELETE FROM analysis_history
      WHERE deleted = true AND deleted_at < ${thirtyDaysAgo}
    `;
    return true;
  } catch (error) {
    console.error('Error cleaning up old trash items:', error);
    throw error;
  }
}

// Export the sql client for direct use
export { sql };
