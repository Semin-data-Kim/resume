# AI 채용 공고 분석 서비스 🚀

이력서와 채용 공고를 AI로 분석하여 맞춤형 인사이트를 제공하는 SaaS 서비스입니다.

## 📋 프로젝트 개요

이 서비스는 사용자가 크롬 확장프로그램으로 채용 공고를 수집하면, 미리 업로드한 이력서와 비교하여:
- 강점/약점 분석
- 맞춤형 면접 질문 생성
- 합격 가능성 평가

등의 기능을 제공합니다.

## 🛠️ 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **스타일링**: Tailwind CSS
- **데이터베이스/인증**: Supabase (PostgreSQL, Auth, Storage)
- **AI 연동**: Anthropic Claude API
- **언어**: TypeScript
- **배포**: Vercel (예정)

## 📁 프로젝트 구조

```
job-analysis-service/
├── app/                    # Next.js App Router
│   ├── api/               # API 라우트
│   │   └── resumes/
│   │       └── upload/    # 이력서 업로드 API
│   ├── resumes/           # 이력서 관리 페이지
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈 페이지
│   └── globals.css        # 글로벌 스타일
├── components/            # React 컴포넌트
│   └── ResumeUpload.tsx   # 이력서 업로드 폼
├── lib/                   # 유틸리티 함수
│   └── supabase.ts        # Supabase 클라이언트 설정
├── supabase/              # 데이터베이스 스키마
│   └── schema.sql         # DB 스키마 정의
├── .env.local             # 환경 변수 (비공개)
├── .env.local.example     # 환경 변수 예시
└── package.json           # 의존성 관리
```

## 🚀 시작하기

### 1. 필수 조건

- Node.js 18 이상
- npm 또는 yarn
- Supabase 계정 (무료)

### 2. 설치 방법

```bash
# 의존성 설치
npm install

# 또는
yarn install
```

### 3. Supabase 설정

#### 3-1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 로그인
2. "New Project" 버튼 클릭
3. 프로젝트 이름 입력 (예: job-analysis-service)
4. 데이터베이스 비밀번호 설정
5. 리전 선택 (가까운 지역 선택)
6. 프로젝트 생성 완료 대기 (약 2분)

#### 3-2. API 키 복사

1. Supabase 대시보드에서 프로젝트 선택
2. 왼쪽 메뉴에서 ⚙️ Settings → API 클릭
3. 다음 정보를 복사:
   - **Project URL** (예: https://xxxxx.supabase.co)
   - **anon/public key** (긴 문자열)

#### 3-3. 환경 변수 설정

`.env.local` 파일을 열고 복사한 값을 붙여넣기:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **주의**: 실제 값으로 교체하세요!

#### 3-4. 데이터베이스 스키마 생성

1. Supabase 대시보드에서 🔧 **SQL Editor** 클릭
2. "New query" 버튼 클릭
3. `supabase/schema.sql` 파일의 내용을 복사하여 붙여넣기
4. "Run" 버튼 클릭하여 실행
5. 성공 메시지 확인

이제 데이터베이스에 `profiles`, `resumes`, `analysis_reports` 테이블이 생성되었습니다!

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요!

## 📖 사용 방법

### 이력서 업로드하기

1. 홈 페이지에서 "이력서 관리" 카드 클릭
2. 이력서 제목 입력 (예: "2024년 개발자 이력서")
3. PDF 파일 선택
4. "업로드" 버튼 클릭
5. 성공 메시지 확인!

업로드된 이력서는 Supabase 데이터베이스에 안전하게 저장됩니다.

## 🔧 주요 기능

### ✅ 완성된 기능

- [x] Next.js 프로젝트 초기 설정
- [x] Tailwind CSS 스타일링
- [x] Supabase 연동
- [x] 데이터베이스 스키마 설계
- [x] PDF 이력서 업로드
- [x] PDF 텍스트 자동 추출
- [x] 이력서 데이터베이스 저장

### 🚧 진행 예정

- [ ] 사용자 인증 (Supabase Auth)
- [ ] 이력서 목록 조회
- [ ] 이력서 수정/삭제
- [ ] 채용 공고 크롤링 (크롬 확장프로그램)
- [ ] AI 분석 (Claude API 연동)
- [ ] 분석 리포트 생성
- [ ] 대시보드 UI
- [ ] Vercel 배포

## ⚠️ 다음 단계: Supabase 설정 필수!

현재 PDF 업로드 기능이 코드상으로는 완성되었지만, **실제로 작동하려면 Supabase 설정이 필요**합니다.

### 🔴 필수 작업 (반드시 완료하세요!)

#### 1단계: Supabase 프로젝트 생성

1. [Supabase](https://supabase.com)에 접속하여 로그인
2. "New Project" 버튼 클릭
3. 프로젝트 이름 입력 (예: job-analysis-service)
4. 데이터베이스 비밀번호 설정 (잊지 마세요!)
5. 리전 선택 (Northeast Asia - Seoul 권장)
6. 프로젝트 생성 완료 대기 (약 2분)

#### 2단계: API 키 복사 및 환경변수 설정

1. Supabase 대시보드에서 프로젝트 선택
2. 왼쪽 메뉴에서 ⚙️ **Settings** → **API** 클릭
3. 다음 정보를 복사:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon/public key** (긴 JWT 토큰 문자열)

4. `.env.local` 파일을 열고 다음과 같이 수정:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **중요**: `your_supabase_project_url`과 `your_supabase_anon_key`를 실제 값으로 교체하세요!

#### 3단계: 데이터베이스 테이블 생성

1. Supabase 대시보드에서 🔧 **SQL Editor** 클릭
2. "New query" 버튼 클릭
3. `supabase/schema.sql` 파일의 **전체 내용**을 복사하여 붙여넣기
4. **"Run"** 버튼 클릭하여 실행
5. "Success. No rows returned" 메시지 확인

#### 4단계: 개발 서버 재시작

```bash
# 현재 실행 중인 서버 종료 (Ctrl+C)
# 그 다음 다시 시작
npm run dev
```

#### 5단계: 테스트!

1. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속
2. "이력서 관리" 카드 클릭
3. 이력서 제목 입력 (예: "2024년 개발자 이력서")
4. PDF 파일 선택 (텍스트가 있는 PDF만 가능, 스캔본 불가)
5. "업로드" 버튼 클릭
6. ✅ "이력서가 성공적으로 업로드되었습니다!" 메시지 확인

---

## 🐛 문제 해결

### PDF 업로드가 안 돼요!

- **Supabase 환경 변수가 올바르게 설정되었는지 확인** (위 2단계 참고)
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 개발 서버를 재시작해보세요: `Ctrl+C` 후 `npm run dev`
- 브라우저 개발자 도구(F12)에서 Console 탭을 확인하여 오류 메시지 확인

### 데이터베이스 오류가 발생해요!

- Supabase SQL Editor에서 `schema.sql`을 실행했는지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

### 스캔된 PDF는 왜 안 되나요?

- 현재 버전은 텍스트가 포함된 PDF만 지원합니다
- 이미지 기반 PDF(스캔본)는 OCR 기능을 추가해야 합니다

## 📚 참고 자료

- [Next.js 공식 문서](https://nextjs.org/docs)
- [Supabase 공식 문서](https://supabase.com/docs)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs/)

## 👨‍💻 개발자

초보자도 쉽게 따라할 수 있도록 단계별로 구성했습니다.
궁금한 점이 있으면 언제든지 문의하세요!

## 📄 라이선스

ISC License

---

**다음 단계**: 사용자 인증 추가하기 →
