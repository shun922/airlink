import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-sky-50">
      <div className="text-center mb-8">
        <p className="text-sky-400 text-sm tracking-widest uppercase mb-2">Salon</p>
        <h1 className="text-3xl font-light text-slate-700 mb-4 tracking-wide">ご予約</h1>
        <p className="text-slate-500 max-w-md mx-auto leading-relaxed">
          ご希望の日時をお選びいただき、<br />
          オンラインでお手軽にご予約いただけます。
        </p>
      </div>
      <Link
        href="/book"
        className="px-8 py-3 bg-sky-400 text-white rounded-full hover:bg-sky-500 transition-colors shadow-sm"
      >
        予約する
      </Link>
      <Link
        href="/admin"
        className="mt-6 text-sky-500 hover:text-sky-600 text-sm"
      >
        管理画面へ
      </Link>
    </main>
  );
}
