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
const sqlClient = neon(process.env.DATABASE_URL || '');

// Function to initialize the database schema
async function initializeDatabase(): Promise<boolean> {
  try {
    // Create users table if it doesn't exist
    await sqlClient`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create analysis_history table if it doesn't exist
    await sqlClient`
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
      await sqlClient`
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
async function upsertUser(userId: string, email: string): Promise<any> {
  try {
    const result = await sqlClient`
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
async function saveAnalysisHistory(
  userId: string, 
  imageUrl: string, 
  analysisText: string, 
  metadata: any = {}
): Promise<any> {
  try {
    const result = await sqlClient`
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
async function getUserAnalysisHistory(
  userId: string, 
  limit: number = 10, 
  offset: number = 0,
  showDeleted: boolean = false
): Promise<any[]> {
  try {
    const result = await sqlClient`
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
async function getAnalysisById(
  id: string | number, 
  userId: string,
  includeDeleted: boolean = false
): Promise<any | null> {
  try {
    const query = includeDeleted 
      ? sqlClient`SELECT * FROM analysis_history WHERE id = ${id} AND user_id = ${userId}`
      : sqlClient`SELECT * FROM analysis_history WHERE id = ${id} AND user_id = ${userId} AND deleted = false`;
    
    const result = await query;
    return result[0] || null;
  } catch (error) {
    console.error('Error getting analysis by ID:', error);
    throw error;
  }
}

// Function to mark analyses as deleted (move to trash)
async function moveAnalysesToTrash(
  ids: number[], 
  userId: string
): Promise<boolean> {
  try {
    const now = new Date();
    
    // Process each ID individually to avoid array conversion issues
    for (const id of ids) {
      await sqlClient`
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
async function restoreAnalysesFromTrash(
  ids: number[], 
  userId: string
): Promise<boolean> {
  try {
    // Process each ID individually to avoid array conversion issues
    for (const id of ids) {
      await sqlClient`
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

import { del } from '@vercel/blob';

// Function to permanently delete analyses
async function permanentlyDeleteAnalyses(
  ids: number[], 
  userId: string
): Promise<boolean> {
  console.log(`Attempting to permanently delete items with IDs: [${ids.join(', ')}] for user: ${userId}`);
  try {
    // First get all the image URLs and IDs we need to delete
    const itemsToDelete = await sqlClient`
      SELECT id, image_url FROM analysis_history
      WHERE id = ANY(${ids}) AND user_id = ${userId}
    `;

    if (itemsToDelete.length === 0) {
      console.log(`No items found matching IDs [${ids.join(', ')}] for user ${userId} to permanently delete.`);
      // If no items are found, it could be that they were already deleted or IDs are incorrect.
      // We can consider this a "success" in the sense that the desired state (items gone) is achieved.
      return true; 
    }

    console.log(`Found ${itemsToDelete.length} items to permanently delete for user ${userId}.`);

    // Delete all blob files first
    let blobDeletionAttempts = 0;
    let blobDeletionSuccesses = 0;
    for (const item of itemsToDelete) {
      try {
        if (item.image_url) {
          blobDeletionAttempts++;
          await del(item.image_url);
          console.log(`Successfully deleted blob: ${item.image_url} for item ID ${item.id}`);
          blobDeletionSuccesses++;
        }
      } catch (blobError) {
        console.error(`Error deleting blob: ${item.image_url} for item ID ${item.id}:`, blobError);
        // Continue even if blob deletion fails
      }
    }
    console.log(`Blob deletion: ${blobDeletionSuccesses}/${blobDeletionAttempts} successful for user ${userId}.`);

    // Then delete the database records
    // We use the IDs from itemsToDelete to ensure we only try to delete records that were confirmed to exist for this user
    const actualIdsToDelete = itemsToDelete.map(item => item.id);
    if (actualIdsToDelete.length > 0) {
      const deleteResult = await sqlClient`
        DELETE FROM analysis_history
        WHERE id = ANY(${actualIdsToDelete}) AND user_id = ${userId}
      `;
      // Note: serverless-sql might not return affectedRows directly in deleteResult.
      // A successful execution without an error implies success.
      console.log(`Successfully deleted ${actualIdsToDelete.length} records from database for user ${userId}.`);
    } else {
      // This case should ideally not be reached if itemsToDelete was not empty,
      // but as a safeguard:
      console.log(`No database records to delete for user ${userId} after blob processing.`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error in permanentlyDeleteAnalyses for user ${userId}, IDs [${ids.join(', ')}]:`, error);
    throw error;
  }
}

// Function to clean up old trash items (older than 30 days)
async function cleanupOldTrashItems(): Promise<boolean> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Find items to delete
    const itemsToClean = await sqlClient`
      SELECT id, image_url FROM analysis_history
      WHERE deleted = true AND deleted_at < ${thirtyDaysAgo}
    `;

    if (itemsToClean.length === 0) {
      console.log('No old trash items to clean up.');
      return true;
    }

    console.log(`Found ${itemsToClean.length} old trash items to clean up.`);

    // Delete blobs
    for (const item of itemsToClean) {
      try {
        if (item.image_url) {
          await del(item.image_url);
          console.log('Cleaned up blob:', item.image_url);
        }
      } catch (blobError) {
        console.error('Error cleaning up blob:', item.image_url, blobError);
        // Continue even if blob deletion fails
      }
    }

    // Delete database records
    const idsToClean = itemsToClean.map(item => item.id);
    await sqlClient`
      DELETE FROM analysis_history
      WHERE id = ANY(${idsToClean})
    `;
    
    console.log(`Successfully cleaned up ${idsToClean.length} old trash items from database.`);
    return true;
  } catch (error) {
    console.error('Error cleaning up old trash items:', error);
    throw error;
  }
}

// Export all functions and the sql client
export {
  initializeDatabase,
  upsertUser,
  saveAnalysisHistory,
  getUserAnalysisHistory,
  getAnalysisById,
  moveAnalysesToTrash,
  restoreAnalysesFromTrash,
  permanentlyDeleteAnalyses,
  cleanupOldTrashItems,
  sqlClient as sql // Export sqlClient as sql for compatibility
};
