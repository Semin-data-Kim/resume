import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('analysis_reports')
      .select([
        'id',
        'job_posting_title',
        'job_posting_company',
        'job_posting_url',
        'matching_score',
        'match_reason',
        'required_experience',
        'winning_points',
        'strategic_advices',
        'interview_questions',
        'user_id',
      ].join(','))
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: '리포트 조회 실패', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: '리포트를 찾을 수 없습니다.' },
        { status: 404 }
      );
    }

    const reportData = {
      header: {
        company_name: data.job_posting_company || '회사명 없음',
        job_title: data.job_posting_title || '제목 없음',
        job_url: data.job_posting_url || '',
        match_score: data.matching_score || 0,
        match_reason: data.match_reason || '분석 완료되었습니다.',
        required_experience: data.required_experience || '정보 없음',
      },
      career_assessment: {
        winning_points: data.winning_points || [],
        strategic_advices: data.strategic_advices || [],
      },
      interview_strategy: data.interview_questions || [],
    };

    return NextResponse.json({ data: reportData });
  } catch (error: any) {
    return NextResponse.json(
      { error: '리포트 조회 중 오류가 발생했습니다.', details: error.message },
      { status: 500 }
    );
  }
}
