"use client";

import { useEffect, useState } from "react";

interface Reservation {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  notes: string | null;
  status: string;
  resources: { name: string } | null;
}

interface Resource {
  id: string;
  name: string;
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterResource, setFilterResource] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchReservations = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterDate) params.set("date", filterDate);
    if (filterResource) params.set("resourceId", filterResource);
    if (filterStatus) params.set("status", filterStatus);
    fetch(`/api/reservations?${params}`)
      .then((r) => r.json())
      .then((data) => setReservations(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetch("/api/resources")
      .then((r) => r.json())
      .then((data) => setResources(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    fetchReservations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate, filterResource, filterStatus]);

  const handleCancel = async (id: string) => {
    if (!confirm("この予約をキャンセルしますか？")) return;
    const res = await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    if (res.ok) {
      fetchReservations();
    } else {
      const err = await res.json();
      alert(err.error || "キャンセルに失敗しました");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">予約一覧</h1>

      <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-4">
        <div>
          <label className="block text-sm text-slate-600 mb-1">日付</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">リソース</label>
          <select
            value={filterResource}
            onChange={(e) => setFilterResource(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md"
          >
            <option value="">すべて</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm text-slate-600 mb-1">ステータス</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md"
          >
            <option value="">すべて</option>
            <option value="confirmed">確定</option>
            <option value="cancelled">キャンセル</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">日付</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">時間</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">リソース</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">お客様名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">連絡先</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">ステータス</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-900">{r.date}</td>
                <td className="px-6 py-4 text-slate-600">{r.start_time}–{r.end_time}</td>
                <td className="px-6 py-4 text-slate-600">{(r.resources as { name?: string })?.name || "-"}</td>
                <td className="px-6 py-4 text-slate-900">{r.customer_name}</td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                  {r.customer_email || r.customer_phone || "-"}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      r.status === "confirmed"
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {r.status === "confirmed" ? "確定" : "キャンセル"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {r.status === "confirmed" && (
                    <button
                      onClick={() => handleCancel(r.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      キャンセル
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reservations.length === 0 && !loading && (
          <div className="px-6 py-12 text-center text-slate-500">
            予約がありません
          </div>
        )}
      </div>
    </div>
  );
}
