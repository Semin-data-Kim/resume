import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-4">
          AI 채용 공고 분석 서비스
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          이력서와 채용 공고를 AI로 분석하여 맞춤형 인사이트를 제공합니다
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <Link href="/resumes">
            <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow cursor-pointer hover:border-blue-500">
              <h2 className="text-xl font-semibold mb-2">📄 이력서 관리</h2>
              <p className="text-gray-600 dark:text-gray-400">
                PDF 이력서를 업로드하고 관리하세요
              </p>
            </div>
          </Link>

          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow opacity-50">
            <h2 className="text-xl font-semibold mb-2">🔍 공고 분석</h2>
            <p className="text-gray-600 dark:text-gray-400">
              채용 공고와 이력서를 비교 분석합니다
            </p>
            <p className="text-xs text-gray-500 mt-2">(곧 출시 예정)</p>
          </div>
        </div>
      </main>
    </div>
  );
}
