"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Resource {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  category: string;
}

interface Reservation {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  status: string;
  resources: { name: string } | null;
}

export default function AdminDashboard() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/resources").then((r) => r.json()),
      fetch("/api/reservations?status=confirmed").then((r) => r.json()),
    ]).then(([resData, revData]) => {
      setResources(Array.isArray(resData) ? resData : []);
      setReservations(Array.isArray(revData) ? revData : []);
      setLoading(false);
    });
  }, []);

  const todayReservations = reservations.filter((r) => r.date === new Date().toISOString().split("T")[0]);

  if (loading) {
    return <div className="text-slate-600">読み込み中...</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">ダッシュボード</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-2">リソース数</h2>
          <p className="text-3xl font-bold text-blue-600">{resources.length}</p>
          <Link href="/admin/resources" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
            管理する →
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-2">本日の予約</h2>
          <p className="text-3xl font-bold text-green-600">{todayReservations.length}</p>
          <Link href="/admin/reservations" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
            一覧を見る →
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-slate-700 mb-2">総予約数</h2>
          <p className="text-3xl font-bold text-slate-800">{reservations.length}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">本日の予約一覧</h2>
        {todayReservations.length === 0 ? (
          <p className="text-slate-500">本日の予約はありません</p>
        ) : (
          <ul className="divide-y divide-slate-200">
            {todayReservations.map((r) => (
              <li key={r.id} className="py-3 flex justify-between items-center">
                <span>
                  {(r.resources as { name?: string })?.name || "-"} {r.start_time}–{r.end_time} {r.customer_name}
                </span>
                <span className="text-slate-500 text-sm">{r.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
