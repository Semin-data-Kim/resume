import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import pdf from 'pdf-parse';

// Force Node.js runtime for pdf-parse compatibility
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const title = (formData.get('title') as string) || '';
    const file = formData.get('file') as File;
    const type = (formData.get('type') as string) || 'resume';

    // 입력 검증
    if (!file) {
      return NextResponse.json(
        { error: '파일을 선택해야 합니다.' },
        { status: 400 }
      );
    }

    // 타입 검증
    if (!['resume', 'portfolio'].includes(type)) {
      return NextResponse.json(
        { error: 'type은 resume 또는 portfolio여야 합니다.' },
        { status: 400 }
      );
    }

    // PDF 파일 확인
    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'PDF 파일만 업로드 가능합니다.' },
        { status: 400 }
      );
    }

    // PDF 파일을 Buffer로 변환
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // PDF에서 텍스트 추출
    let extractedText = '';
    try {
      const pdfData = await pdf(buffer);
      extractedText = pdfData.text;

      if (!extractedText || extractedText.trim().length === 0) {
        return NextResponse.json(
          { error: 'PDF에서 텍스트를 추출할 수 없습니다. 스캔된 PDF는 지원하지 않습니다.' },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error('PDF parsing error:', error);
      return NextResponse.json(
        { error: 'PDF 파일을 읽는 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    // Supabase에 이력서 저장
    const storedTitle = title || file.name;
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: user.id,
        title: storedTitle,
        content: extractedText,
        file_url: null, // 나중에 Storage 연동 시 업데이트
        type: type,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '데이터베이스 저장 중 오류가 발생했습니다: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: type === 'portfolio'
        ? '포트폴리오가 성공적으로 업로드되었습니다.'
        : '이력서가 성공적으로 업로드되었습니다.',
      resume: {
        id: data.id,
        title: data.title,
        contentLength: extractedText.length,
      },
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '업로드 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

// GET: 이력서 목록 조회 (추가 기능)
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('resumes')
      .select('id, title, created_at, updated_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: '데이터베이스 조회 중 오류가 발생했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ resumes: data });

  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: '조회 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
