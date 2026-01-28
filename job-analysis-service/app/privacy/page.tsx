import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-3">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Privacy Policy</p>
          <h1 className="text-3xl font-black">개인정보처리방침</h1>
          <p className="text-sm text-slate-500">마지막 업데이트: 2026-01-26</p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed text-slate-700">
          <h2 className="text-lg font-bold text-slate-900">1. 수집하는 개인정보</h2>
          <p>서비스 운영을 위해 아래 정보를 수집할 수 있습니다.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>계정 정보: 이메일</li>
            <li>업로드 문서: 이력서, 포트폴리오 파일 및 추출 텍스트</li>
            <li>서비스 이용기록: 분석 요청/결과, 접속 로그</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-slate-700">
          <h2 className="text-lg font-bold text-slate-900">2. 개인정보의 이용 목적</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>채용 공고 분석 리포트 제공</li>
            <li>서비스 품질 개선 및 안정적 운영</li>
            <li>고객 문의 대응</li>
          </ul>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-slate-700">
          <h2 className="text-lg font-bold text-slate-900">3. 보관 및 파기</h2>
          <p>
            개인정보는 이용 목적 달성 시 지체 없이 파기합니다. 단, 관련 법령에 따라 보관이 필요한 경우
            해당 기간 동안 안전하게 보관 후 파기합니다.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-slate-700">
          <h2 className="text-lg font-bold text-slate-900">4. 제3자 제공</h2>
          <p>
            원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다. 다만, 법령에 따라 요청이 있는 경우는
            예외로 합니다.
          </p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-slate-700">
          <h2 className="text-lg font-bold text-slate-900">5. 이용자의 권리</h2>
          <p>
            이용자는 언제든지 개인정보 조회, 수정, 삭제를 요청할 수 있습니다. 요청은 아래 이메일로
            접수됩니다.
          </p>
          <p className="font-semibold text-slate-900">문의: jobanalysis.ai@gmail.com</p>
        </section>

        <section className="space-y-4 text-sm leading-relaxed text-slate-700">
          <h2 className="text-lg font-bold text-slate-900">6. 변경 고지</h2>
          <p>본 방침이 변경되는 경우 서비스 내 공지사항을 통해 안내합니다.</p>
        </section>

        <div className="pt-4">
          <Link href="/" className="text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-slate-900">
            랜딩으로 돌아가기 →
          </Link>
        </div>
      </div>
    </div>
  );
}
