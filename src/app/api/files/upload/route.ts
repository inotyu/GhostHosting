import { NextResponse } from 'next/server';
import { supabase, supabaseBucket } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const parentId = formData.get('parent_id') as string || null;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'Nenhum arquivo enviado'
      }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Upload to Supabase
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = parentId ? `${parentId}/${fileName}` : fileName;

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from(supabaseBucket)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from(supabaseBucket)
      .getPublicUrl(filePath);

    // Save file metadata to database
    const { data: fileData, error: dbError } = await supabase
      .from('files')
      .insert({
        name: file.name,
        type: 'file',
        parent_id: parentId,
        size: file.size,
        mime_type: file.type,
        url: urlData.publicUrl,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      success: true,
      data: fileData
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao fazer upload'
    }, { status: 500 });
  }
}
