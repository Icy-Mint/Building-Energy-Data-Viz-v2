/**
 * Helper function to upload CSV files to Supabase Storage
 * and save metadata to the database
 */
/**
 * Helper function to upload CSV files to Supabase Storage
 * and save metadata to the database
 * Note: User ID is retrieved server-side from auth session
 */
export async function uploadCsvFile(
  file: File
): Promise<{
  success: boolean;
  data?: {
    id: number;
    userId: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    uploadedAt: Date;
  };
  error?: string;
}> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    // Note: userId is now retrieved server-side from auth session

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Failed to upload file',
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        ...data,
        uploadedAt: new Date(data.uploadedAt),
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Re-export auth functions from client-side auth helper
 * This allows the Upload component to use client-side auth
 */
export { getCurrentUserId, getCurrentUser } from '@/lib/supabase/client';

