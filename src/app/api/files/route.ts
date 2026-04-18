import { NextResponse } from 'next/server';
import { supabase, supabaseBucket } from '@/lib/supabase';

// GET - List files and folders
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parent_id') || '';

    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao listar arquivos'
    }, { status: 500 });
  }
}

// POST - Create folder
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, parent_id } = body;

    const { data, error } = await supabase
      .from('files')
      .insert({
        name,
        parent_id: parent_id || null,
        type: 'folder',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({
      success: false,
      error: 'Erro ao criar pasta'
    }, { status: 500 });
  }
}
