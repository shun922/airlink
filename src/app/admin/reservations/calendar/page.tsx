"use client";

import { useEffect, useState } from "react";

interface Reservation {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  customer_name: string;
  status: string;
  resources: { name: string } | null;
}

interface Resource {
  id: string;
  name: string;
}

export default function CalendarPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetch("/api/resources")
      .then((r) => r.json())
      .then((data) => setResources(Array.isArray(data) ? data : []));
  }, []);

  useEffect(() => {
    fetch(`/api/reservations?date=${selectedDate}&status=confirmed`)
      .then((r) => r.json())
      .then((data) => setReservations(Array.isArray(data) ? data : []));
  }, [selectedDate]);

  const dayReservations = reservations
    .filter((r) => r.date === selectedDate && r.status === "confirmed")
    .sort((a, b) => (a.start_time > b.start_time ? 1 : -1));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">カレンダービュー</h1>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">日付を選択</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 border border-slate-300 rounded-lg"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">
          {selectedDate} の予約
        </h2>
        {dayReservations.length === 0 ? (
          <p className="text-slate-500">この日の予約はありません</p>
        ) : (
          <div className="space-y-3">
            {dayReservations.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div>
                  <span className="font-medium text-slate-800">
                    {(r.resources as { name?: string })?.name || "-"}
                  </span>
                  <span className="text-slate-600 ml-3">
                    {r.start_time}–{r.end_time}
                  </span>
                </div>
                <span className="text-slate-700">{r.customer_name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
