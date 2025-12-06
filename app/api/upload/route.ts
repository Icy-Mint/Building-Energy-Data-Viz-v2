import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { db } from '@/db';
import { files } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'No user ID provided' },
        { status: 400 }
      );
    }

    // Verify user exists (optional check - can be removed if auth handles this)
    // For now, we'll trust the userId from the request
    // In production, get userId from auth session instead

    // Validate file type
    if (!file.name.toLowerCase().endsWith('.csv')) {
      return NextResponse.json(
        { error: 'File must be a CSV file' },
        { status: 400 }
      );
    }

    // Generate unique file path
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${userId}/${timestamp}-${sanitizedFileName}`;

    // Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const fileSize = arrayBuffer.byteLength;

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('csv_uploads')
      .upload(filePath, arrayBuffer, {
        contentType: 'text/csv',
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file to storage', details: uploadError.message },
        { status: 500 }
      );
    }

    // Insert file metadata into database
    const [insertedFile] = await db
      .insert(files)
      .values({
        userId,
        fileName: file.name,
        filePath: uploadData.path,
        fileSize,
      })
      .returning();

    if (!insertedFile) {
      // If database insert fails, try to clean up the uploaded file
      await supabaseAdmin.storage
        .from('csv_uploads')
        .remove([filePath]);

      return NextResponse.json(
        { error: 'Failed to save file metadata' },
        { status: 500 }
      );
    }

    // Return file metadata
    return NextResponse.json({
      id: insertedFile.id,
      userId: insertedFile.userId,
      fileName: insertedFile.fileName,
      filePath: insertedFile.filePath,
      fileSize: insertedFile.fileSize,
      uploadedAt: insertedFile.uploadedAt,
    }, { status: 201 });

  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve user's files
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'No user ID provided' },
        { status: 400 }
      );
    }

    // Fetch user's files from database
    const userFiles = await db
      .select()
      .from(files)
      .where(eq(files.userId, userId))
      .orderBy(files.uploadedAt);

    return NextResponse.json({ files: userFiles }, { status: 200 });

  } catch (error) {
    console.error('Get files API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

