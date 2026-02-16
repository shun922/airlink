"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Resource {
  id: string;
  name: string;
  description: string | null;
  capacity: number;
  category: string;
}

interface Slot {
  start: string;
  end: string;
  available: boolean;
}

const STEPS = ["日付", "リソース", "時間", "入力", "完了"];

export default function BookPage() {
  const [step, setStep] = useState(1);
  const [date, setDate] = useState("");
  const [resourceId, setResourceId] = useState("");
  const [slot, setSlot] = useState<Slot | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [reservationId, setReservationId] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch("/api/resources")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setResources(data);
        } else {
          setResources([
            { id: "demo-1", name: "会議室A", description: "最大8名", capacity: 8, category: "meeting" },
            { id: "demo-2", name: "会議室B", description: "最大4名", capacity: 4, category: "meeting" },
          ]);
        }
      })
      .catch(() => {
        setResources([
          { id: "demo-1", name: "会議室A", description: "最大8名", capacity: 8, category: "meeting" },
          { id: "demo-2", name: "会議室B", description: "最大4名", capacity: 4, category: "meeting" },
        ]);
      });
  }, []);

  useEffect(() => {
    if (!date || !resourceId) return;
    setLoading(true);
    fetch(`/api/slots?date=${date}&resourceId=${resourceId}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.slots || []))
      .catch(() => {
        const def: Slot[] = [];
        for (let h = 9; h < 18; h++) {
          def.push({ start: `${h.toString().padStart(2, "0")}:00`, end: `${(h + 1).toString().padStart(2, "0")}:00`, available: true });
        }
        setSlots(def);
      })
      .finally(() => setLoading(false));
  }, [date, resourceId]);

  const availableSlots = slots.filter((s) => s.available);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceId || !date || !slot) return;
    setLoading(true);

    const isDemo = resourceId.startsWith("demo-");

    if (isDemo) {
      setReservationId("demo-" + Date.now());
      setStep(5);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resource_id: resourceId,
          date,
          start_time: slot.start,
          end_time: slot.end,
          customer_name: customerName,
          customer_email: customerEmail || undefined,
          customer_phone: customerPhone || undefined,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setReservationId(data.id);
        setStep(5);
      } else {
        alert(data.error || "予約に失敗しました。Supabaseの設定を確認してください。");
      }
    } catch {
      alert("通信エラーです。Supabaseの設定を確認してください。");
    } finally {
      setLoading(false);
    }
  };

  const selectedResource = resources.find((r) => r.id === resourceId);

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm">
            ← トップに戻る
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 mb-6">ご予約</h1>

        <div className="flex gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex-1 h-1 rounded ${
                i + 1 <= step ? "bg-blue-600" : "bg-slate-200"
              }`}
              title={s}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">日付を選択</h2>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg"
            />
            <button
              type="button"
              onClick={() => date && setStep(2)}
              disabled={!date}
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              次へ
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">リソースを選択</h2>
            <p className="text-slate-600 mb-4">日付: {date}</p>
            <div className="space-y-2">
              {resources.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  onClick={() => {
                    setResourceId(r.id);
                    setSlot(null);
                  }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                    resourceId === r.id
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-400"
                      : "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                  }`}
                >
                  <span className="font-medium">{r.name}</span>
                  {r.description && (
                    <span className="block text-sm text-slate-500 mt-1">{r.description}</span>
                  )}
                </button>
              ))}
            </div>
            {resources.length === 0 && <p className="text-slate-500">リソースがありません</p>}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                戻る
              </button>
              <button
                type="button"
                onClick={() => resourceId && setStep(3)}
                disabled={!resourceId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                次へ
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">時間を選択</h2>
            <p className="text-slate-600 mb-4">
              {date} / {selectedResource?.name}
            </p>
            {loading ? (
              <p className="text-slate-500">読み込み中...</p>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {availableSlots.map((s) => (
                  <button
                    type="button"
                    key={`${s.start}-${s.end}`}
                    onClick={() => setSlot(s)}
                    className={`p-3 rounded-lg border-2 text-sm cursor-pointer ${
                      slot?.start === s.start
                        ? "border-blue-600 bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {s.start}
                  </button>
                ))}
              </div>
            )}
            {!loading && availableSlots.length === 0 && (
              <p className="text-slate-500 mt-4">この日の空き枠がありません</p>
            )}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                戻る
              </button>
              <button
                type="button"
                onClick={() => slot && setStep(4)}
                disabled={!slot}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                次へ
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">お客様情報</h2>
            <p className="text-slate-600 mb-4">
              {date} {selectedResource?.name} {slot?.start}–{slot?.end}
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">お名前 *</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">メールアドレス</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">電話番号</label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">備考</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                戻る
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "予約中..." : "予約確定"}
              </button>
            </div>
          </form>
        )}

        {step === 5 && reservationId && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">予約が完了しました</h2>
            <p className="text-slate-600 mb-6">
              {date} {selectedResource?.name} {slot?.start}–{slot?.end}
            </p>
            {reservationId.startsWith("demo-") && (
              <p className="text-amber-600 text-sm mb-4 bg-amber-50 p-2 rounded">
                ※ デモモードです。本番予約はSupabaseの設定が必要です。
              </p>
            )}
            <p className="text-slate-500 text-sm mb-6">
              ご予約ありがとうございます。ご来店をお待ちしております。
            </p>
            <Link
              href="/book"
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              別の予約をする
            </Link>
            <Link
              href="/"
              className="block mt-4 text-slate-500 hover:text-slate-700"
            >
              トップに戻る
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
