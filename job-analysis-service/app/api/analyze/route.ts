import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase-server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// JSON 클렌징 함수: 마크다운 태그 제거
function cleanJsonResponse(text: string): string {
  // ```json과 ``` 태그 제거
  let cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
  // 앞뒤 공백 제거
  cleaned = cleaned.trim();
  return cleaned;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      resumeText: requestResumeText,
      jobPostingText: requestJobPostingText,
      jobPosting,
      jobTitle,
      companyName,
      jobPostingUrl,
    } = body;

    const jobPostingText = requestJobPostingText || jobPosting;

    if (!jobPostingText) {
      return NextResponse.json(
        { error: 'jobPostingText는 필수입니다.' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const today = new Date().toISOString().slice(0, 10);
    const { data: usageRow, error: usageError } = await supabase
      .from('analysis_usage')
      .select('count')
      .eq('user_id', user.id)
      .eq('used_on', today)
      .maybeSingle();

    if (usageError) {
      console.error('분석 사용량 조회 실패:', usageError);
      return NextResponse.json(
        { error: '분석 사용량을 확인할 수 없습니다.' },
        { status: 500 }
      );
    }

    if ((usageRow?.count ?? 0) >= 3) {
      return NextResponse.json(
        { error: '오늘의 무료 분석 횟수를 모두 사용했습니다.' },
        { status: 429 }
      );
    }

    let resumeText = requestResumeText;
    let resumeId: string | null = null;
    let portfolioText = '';

    if (!resumeText) {
      const { data: resumeRows, error: resumeError } = await supabase
        .from('resumes')
        .select('id, content')
        .eq('user_id', user.id)
        .eq('type', 'resume')
        .order('created_at', { ascending: false })
        .limit(1);

      if (resumeError) {
        console.error('이력서 조회 실패:', resumeError);
        return NextResponse.json(
          { error: '이력서를 불러오는데 실패했습니다.' },
          { status: 500 }
        );
      }

      resumeText = resumeRows?.[0]?.content;
      resumeId = resumeRows?.[0]?.id ?? null;
    }

    if (!resumeText) {
      return NextResponse.json(
        { error: '최신 이력서를 찾을 수 없습니다.' },
        { status: 400 }
      );
    }

    if (!resumeId) {
      const { data: resumeRows } = await supabase
        .from('resumes')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', 'resume')
        .order('created_at', { ascending: false })
        .limit(1);

      resumeId = resumeRows?.[0]?.id ?? null;
    }

    const { data: portfolioRows } = await supabase
      .from('resumes')
      .select('content')
      .eq('user_id', user.id)
      .eq('type', 'portfolio')
      .order('created_at', { ascending: false })
      .limit(1);

    portfolioText = portfolioRows?.[0]?.content || '';

    // Claude API 호출 (모델명 고정: claude-sonnet-4-20250514)
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: `당신은 채용 전문 컨설턴트입니다. 아래 이력서와 채용 공고를 **엄격하게** 비교 분석하여 JSON 형식으로 결과를 제공하세요.

**이력서:**
${resumeText}

${portfolioText ? `**포트폴리오:**\n${portfolioText}\n` : ''}

**채용 공고:**
제목: ${jobTitle || '제목 없음'}
회사: ${companyName || '회사명 없음'}
내용:
${jobPostingText}

**응답 형식 (반드시 JSON만 출력):**
{
  "matching_score": 85,
  "match_reason": "매칭 점수에 대한 한 문장 설명",
  "required_experience": "요구 경력 (예: 3년 이상)",
  "winning_points": [
    {
      "title": "강점 제목",
      "description": "구체적인 설명"
    }
  ],
  "strategic_advices": [
    {
      "title": "보완 전략 제목",
      "description": "구체적인 조언"
    }
  ],
  "interview_questions": [
    {
      "question": "면접 예상 질문",
      "tip": "답변 팁"
    }
  ]
}

**분석 가이드:**
- matching_score: 0-100 사이의 점수 (이력서와 공고의 적합도). **후하게 주지 말 것.**
- match_reason: 매칭 점수에 대한 간단한 이유 (한 문장). **과장 금지, 근거를 포함.**
- required_experience: 공고에서 요구하는 경력 그대로 추출
- winning_points: 이력서의 강점 3-5개 (공고 요구사항과 **직접 매칭되는** 부분만)
- strategic_advices: 보완이 필요한 부분과 전략 3-5개
- interview_questions: 예상 면접 질문 5-7개 (각 질문에 tip 포함)

**엄격 평가 규칙:**
1) 경력 요구사항이 미달이면 matching_score는 70점을 넘지 말 것.
2) 업종/도메인 경험이 미달이면 10~25점 감점할 것.
3) 자격요건의 핵심 키워드(예: "간편결제", "커머스", "IT")가 이력서에 **직접적으로** 없으면 감점할 것.
4) 숫자/기간은 **추정하지 말고** 이력서에 있는 내용만 근거로 판단할 것.
5) 근거가 불충분하면 match_reason에 "정보 부족" 또는 "직접 근거 없음"을 명시할 것.

응답은 반드시 순수한 JSON 형식만 출력하세요. 마크다운이나 다른 텍스트는 포함하지 마세요.`,
        },
      ],
    });

    // 응답 텍스트 추출
    const responseText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    // JSON 클렌징
    const cleanedJson = cleanJsonResponse(responseText);

    // JSON 파싱
    let analysisData;
    try {
      analysisData = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error('JSON 파싱 실패:', cleanedJson);
      return NextResponse.json(
        { error: 'AI 응답을 파싱하는데 실패했습니다.', raw: cleanedJson },
        { status: 500 }
      );
    }

    const requiredExperienceFromPosting = (() => {
      if (!jobPostingText) return '';
      const match = jobPostingText.match(/경력\s*([0-9]+)\s*년/);
      if (match?.[1]) {
        return `${match[1]}년`;
      }
      return '';
    })();

    const requiredExperience =
      analysisData.required_experience ||
      requiredExperienceFromPosting ||
      '정보 없음';

    const interviewQuestions =
      analysisData.interview_questions ||
      analysisData.interview_strategy ||
      [];

    const { data, error } = await supabase
      .from('analysis_reports')
      .insert({
        user_id: user.id,
        resume_id: resumeId,
        job_posting_title: jobTitle || '제목 없음',
        job_posting_company: companyName || '회사명 없음',
        job_posting_content: jobPostingText,
        job_posting_url: jobPostingUrl || null,
        resume_content: resumeText,
        matching_score: analysisData.matching_score || 0,
        match_reason: analysisData.match_reason || null,
        required_experience: requiredExperience,
        winning_points: analysisData.winning_points || [],
        strategic_advices: analysisData.strategic_advices || [],
        interview_questions: interviewQuestions,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase 저장 실패:', error);
      return NextResponse.json(
        { error: 'DB 저장에 실패했습니다.', details: error.message },
        { status: 500 }
      );
    }

    const nextCount = (usageRow?.count ?? 0) + 1;
    const { error: usageUpdateError } = await supabase
      .from('analysis_usage')
      .upsert(
        {
          user_id: user.id,
          used_on: today,
          count: nextCount,
        },
        { onConflict: 'user_id,used_on' }
      );

    if (usageUpdateError) {
      console.error('분석 사용량 업데이트 실패:', usageUpdateError);
    }

    // 클라이언트가 기대하는 형식으로 데이터 구성
    const reportData = {
      header: {
        company_name: companyName || '회사명 없음',
        job_title: jobTitle || '제목 없음',
        match_score: analysisData.matching_score || 0,
        match_reason: analysisData.match_reason || '분석 완료되었습니다.',
        required_experience: requiredExperience,
      },
      career_assessment: {
        winning_points: analysisData.winning_points || [],
        strategic_advices: analysisData.strategic_advices || [],
      },
      interview_strategy: interviewQuestions,
    };

    // DB ID와 전체 데이터 반환
    return NextResponse.json({
      success: true,
      reportId: data.id,
      remaining: Math.max(0, 3 - nextCount),
      data: reportData,
    });
  } catch (error: any) {
    console.error('분석 에러:', error);
    return NextResponse.json(
      { error: '분석 중 오류가 발생했습니다.', details: error.message },
      { status: 500 }
    );
  }
}
