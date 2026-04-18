import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    const SECRET_PASSWORD = process.env.SECRET_PASSWORD || 'gean2026@';

    if (password === SECRET_PASSWORD) {
      return NextResponse.json({
        success: true,
        message: 'Senha correta'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Senha incorreta'
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Erro ao verificar senha'
    }, { status: 500 });
  }
}
