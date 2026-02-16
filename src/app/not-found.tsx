import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-sky-50 flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-medium text-slate-700 mb-4">ページが見つかりません</h2>
      <Link
        href="/"
        className="px-6 py-2 bg-sky-400 text-white rounded-full hover:bg-sky-500"
      >
        トップへ戻る
      </Link>
    </div>
  );
}
