import { createClient } from '@supabase/supabase-js';

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

// Initialize the Supabase client with the connection details
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

// Function to initialize the database schema
async function initializeDatabase(): Promise<boolean> {
  try {
    // Note: Table creation is typically done via Supabase dashboard.
    // If you need to ensure tables exist, you can use RPC or check for table existence.
    // For simplicity, we assume tables are created in Supabase dashboard.
    // Optionally, you can implement RPC functions in Supabase for table creation if needed.
    console.log('Assuming database schema is initialized via Supabase dashboard.');
    return true;
  } catch (error) {
    console.error('Error initializing database schema:', error);
    return false;
  }
}

// Function to create or update a user
async function upsertUser(userId: string, email: string): Promise<any> {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({ id: userId, email: email }, { onConflict: 'id' })
      .select();
    
    if (error) throw error;
    return data[0];
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
    const { data, error } = await supabase
      .from('analysis_history')
      .insert({ user_id: userId, image_url: imageUrl, analysis_text: analysisText, metadata: metadata })
      .select();
    
    if (error) throw error;
    return data[0];
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
    const { data, error } = await supabase
      .from('analysis_history')
      .select('*')
      .eq('user_id', userId)
      .eq('deleted', showDeleted)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    return data;
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
    let query = supabase
      .from('analysis_history')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId);
    
    if (!includeDeleted) {
      query = query.eq('deleted', false);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data[0] || null;
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
    const now = new Date().toISOString();
    
    for (const id of ids) {
      const { error } = await supabase
        .from('analysis_history')
        .update({ deleted: true, deleted_at: now })
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) {
        console.error(`Error updating ID ${id}:`, error);
        continue;
      }
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
    for (const id of ids) {
      const { error } = await supabase
        .from('analysis_history')
        .update({ deleted: false, deleted_at: null })
        .eq('id', id)
        .eq('user_id', userId);
      
      if (error) {
        console.error(`Error restoring ID ${id}:`, error);
        continue;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error restoring analyses from trash:', error);
    throw error;
  }
}

// Function to permanently delete analyses
async function permanentlyDeleteAnalyses(
  ids: number[], 
  userId: string
): Promise<boolean> {
  console.log(`Attempting to permanently delete items with IDs: [${ids.join(', ')}] for user: ${userId}`);
  try {
    // First get all the image URLs and IDs we need to delete
    const { data: itemsToDelete, error } = await supabase
      .from('analysis_history')
      .select('id, image_url')
      .in('id', ids)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (itemsToDelete.length === 0) {
      console.log(`No items found matching IDs [${ids.join(', ')}] for user ${userId} to permanently delete.`);
      return true;
    }
    
    console.log(`Found ${itemsToDelete.length} items to permanently delete for user ${userId}.`);
    
    // Delete all blob files first (using Supabase Storage)
    let blobDeletionAttempts = 0;
    let blobDeletionSuccesses = 0;
    for (const item of itemsToDelete) {
      try {
        if (item.image_url) {
          blobDeletionAttempts++;
          const filePath = item.image_url.split('/').pop(); // Extract the file path from URL
          if (filePath) {
            await supabase.storage.from('analysis-images').remove([filePath]);
            console.log(`Successfully deleted blob: ${item.image_url} for item ID ${item.id}`);
            blobDeletionSuccesses++;
          }
        }
      } catch (blobError) {
        console.error(`Error deleting blob: ${item.image_url} for item ID ${item.id}:`, blobError);
        // Continue even if blob deletion fails
      }
    }
    console.log(`Blob deletion: ${blobDeletionSuccesses}/${blobDeletionAttempts} successful for user ${userId}.`);
    
    // Then delete the database records
    const actualIdsToDelete = itemsToDelete.map(item => item.id);
    if (actualIdsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('analysis_history')
        .delete()
        .in('id', actualIdsToDelete)
        .eq('user_id', userId);
      
      if (deleteError) throw deleteError;
      console.log(`Successfully deleted ${actualIdsToDelete.length} records from database for user ${userId}.`);
    } else {
      console.log(`No database records to delete for user ${userId} after blob processing.`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error in permanentlyDeleteAnalyses for user ${userId}, IDs [${ids.join(', ')}]:`, error);
    throw error;
  }
}

// New function with the same logic but different name
async function executePermanentDeletion(
  ids: number[], 
  userId: string
): Promise<boolean> {
  console.log(`Attempting to executePermanentDeletion for items with IDs: [${ids.join(', ')}] for user: ${userId}`);
  try {
    const { data: itemsToDelete, error } = await supabase
      .from('analysis_history')
      .select('id, image_url')
      .in('id', ids)
      .eq('user_id', userId);
    
    if (error) throw error;
    
    if (itemsToDelete.length === 0) {
      console.log(`No items found matching IDs [${ids.join(', ')}] for user ${userId} via executePermanentDeletion.`);
      return true;
    }
    
    console.log(`Found ${itemsToDelete.length} items for executePermanentDeletion for user ${userId}.`);
    
    let blobDeletionAttempts = 0;
    let blobDeletionSuccesses = 0;
    for (const item of itemsToDelete) {
      try {
        if (item.image_url) {
          blobDeletionAttempts++;
          const filePath = item.image_url.split('/').pop(); // Extract the file path from URL
          if (filePath) {
            await supabase.storage.from('analysis-images').remove([filePath]);
            console.log(`executePermanentDeletion: Successfully deleted blob: ${item.image_url} for item ID ${item.id}`);
            blobDeletionSuccesses++;
          }
        }
      } catch (blobError) {
        console.error(`executePermanentDeletion: Error deleting blob: ${item.image_url} for item ID ${item.id}:`, blobError);
      }
    }
    console.log(`executePermanentDeletion: Blob deletion: ${blobDeletionSuccesses}/${blobDeletionAttempts} successful for user ${userId}.`);
    
    const actualIdsToDelete = itemsToDelete.map(item => item.id);
    if (actualIdsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('analysis_history')
        .delete()
        .in('id', actualIdsToDelete)
        .eq('user_id', userId);
      
      if (deleteError) throw deleteError;
      console.log(`executePermanentDeletion: Successfully deleted ${actualIdsToDelete.length} records from database for user ${userId}.`);
    } else {
      console.log(`executePermanentDeletion: No database records to delete for user ${userId} after blob processing.`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error in executePermanentDeletion for user ${userId}, IDs [${ids.join(', ')}]:`, error);
    throw error;
  }
}

// Function to clean up old trash items (older than 30 days)
async function cleanupOldTrashItems(): Promise<boolean> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data: itemsToClean, error } = await supabase
      .from('analysis_history')
      .select('id, image_url')
      .eq('deleted', true)
      .lt('deleted_at', thirtyDaysAgo.toISOString());
    
    if (error) throw error;
    
    if (itemsToClean.length === 0) {
      console.log('No old trash items to clean up.');
      return true;
    }
    
    console.log(`Found ${itemsToClean.length} old trash items to clean up.`);
    
    // Delete blobs
    for (const item of itemsToClean) {
      try {
        if (item.image_url) {
          const filePath = item.image_url.split('/').pop(); // Extract the file path from URL
          if (filePath) {
            await supabase.storage.from('analysis-images').remove([filePath]);
            console.log('Cleaned up blob:', item.image_url);
          }
        }
      } catch (blobError) {
        console.error('Error cleaning up blob:', item.image_url, blobError);
        // Continue even if blob deletion fails
      }
    }
    
    // Delete database records
    const idsToClean = itemsToClean.map(item => item.id);
    const { error: deleteError } = await supabase
      .from('analysis_history')
      .delete()
      .in('id', idsToClean);
    
    if (deleteError) throw deleteError;
    
    console.log(`Successfully cleaned up ${idsToClean.length} old trash items from database.`);
    return true;
  } catch (error) {
    console.error('Error cleaning up old trash items:', error);
    throw error;
  }
}

// Export all functions and the supabase client
export {
  initializeDatabase,
  upsertUser,
  saveAnalysisHistory,
  getUserAnalysisHistory,
  getAnalysisById,
  moveAnalysesToTrash,
  restoreAnalysesFromTrash,
  permanentlyDeleteAnalyses, // Keep old one for now
  executePermanentDeletion,  // Add new one
  cleanupOldTrashItems,
  supabase as sql // Export supabase as sql for compatibility
};
