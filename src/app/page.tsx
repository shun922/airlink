import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">予約システム</h1>
      <p className="text-slate-600 mb-8 max-w-md text-center">
        オンラインで簡単に予約できます。日付と時間を選んでご予約ください。
      </p>
      <Link
        href="/book"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        予約する
      </Link>
      <Link
        href="/admin"
        className="mt-4 text-slate-500 hover:text-slate-700 text-sm"
      >
        管理画面へ
      </Link>
    </main>
  );
}
