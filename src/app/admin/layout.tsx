"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/admin" className="text-xl font-bold text-slate-800">
            管理画面
          </Link>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="text-slate-600 hover:text-slate-900"
            >
              ダッシュボード
            </Link>
            <Link
              href="/admin/resources"
              className="text-slate-600 hover:text-slate-900"
            >
              リソース
            </Link>
            <Link
              href="/admin/reservations"
              className="text-slate-600 hover:text-slate-900"
            >
              予約一覧
            </Link>
            <Link
              href="/admin/reservations/calendar"
              className="text-slate-600 hover:text-slate-900"
            >
              カレンダー
            </Link>
            <Link
              href="/admin/settings"
              className="text-slate-600 hover:text-slate-900"
            >
              設定
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-slate-500 hover:text-slate-700 text-sm"
            >
              ログアウト
            </button>
            <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm">
              トップへ
            </Link>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
