-- AI 채용 공고 분석 서비스 데이터베이스 스키마
-- Supabase 대시보드의 SQL Editor에서 실행하세요

-- 1. users 테이블 (Supabase Auth가 자동으로 생성하는 auth.users를 확장)
-- 추가 사용자 정보가 필요한 경우 profiles 테이블을 생성할 수 있습니다
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. resumes 테이블: 유저의 이력서 정보
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. analysis_reports 테이블: 공고 분석 결과
CREATE TABLE IF NOT EXISTS analysis_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  job_posting_title TEXT NOT NULL,
  job_posting_content TEXT NOT NULL,
  strengths TEXT,
  weaknesses TEXT,
  interview_questions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_user_id ON analysis_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_reports_resume_id ON analysis_reports(resume_id);

-- Row Level Security (RLS) 정책 설정
-- 사용자는 자신의 데이터만 읽고 쓸 수 있습니다

-- profiles 테이블 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- resumes 테이블 RLS
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own resumes"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own resumes"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- analysis_reports 테이블 RLS
ALTER TABLE analysis_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports"
  ON analysis_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reports"
  ON analysis_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
  ON analysis_reports FOR DELETE
  USING (auth.uid() = user_id);

-- Storage 버킷 생성 (PDF 파일 저장용)
-- Supabase 대시보드의 Storage 섹션에서 'resumes' 버킷을 생성하고
-- 아래 정책을 Storage Policies에 추가하세요:
--
-- INSERT: (bucket_id = 'resumes' AND auth.uid() = owner_id)
-- SELECT: (bucket_id = 'resumes' AND auth.uid() = owner_id)
-- UPDATE: (bucket_id = 'resumes' AND auth.uid() = owner_id)
-- DELETE: (bucket_id = 'resumes' AND auth.uid() = owner_id)
