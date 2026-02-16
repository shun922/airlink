"use client";

import { useState, useEffect } from "react";

interface SettingsState {
  business_hours?: { open: string; close: string };
  slot_duration_minutes?: number;
  advance_booking_days?: number;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({});
  const [open, setOpen] = useState("09:00");
  const [close, setClose] = useState("18:00");
  const [slotDuration, setSlotDuration] = useState(30);
  const [advanceDays, setAdvanceDays] = useState(30);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        const bh = data.business_hours as { open?: string; close?: string } | undefined;
        setOpen(bh?.open ?? "09:00");
        setClose(bh?.close ?? "18:00");
        setSlotDuration(data.slot_duration_minutes ?? 30);
        setAdvanceDays(data.advance_booking_days ?? 30);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "business_hours", value: { open, close } }),
      });
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "slot_duration_minutes", value: slotDuration }),
      });
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "advance_booking_days", value: advanceDays }),
      });
      alert("設定を保存しました");
    } catch {
      alert("保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-slate-600">読み込み中...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">設定</h1>

      <form onSubmit={handleSave} className="bg-white rounded-lg shadow p-6 max-w-md">
        <h2 className="text-lg font-semibold text-slate-700 mb-4">営業時間</h2>
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm text-slate-600 mb-1">開始</label>
            <input
              type="time"
              value={open}
              onChange={(e) => setOpen(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-600 mb-1">終了</label>
            <input
              type="time"
              value={close}
              onChange={(e) => setClose(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-md"
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold text-slate-700 mt-6 mb-4">予約枠</h2>
        <div>
          <label className="block text-sm text-slate-600 mb-1">1枠の時間（分）</label>
          <input
            type="number"
            min={10}
            max={120}
            step={5}
            value={slotDuration}
            onChange={(e) => setSlotDuration(parseInt(e.target.value) || 30)}
            className="w-32 px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>

        <div className="mt-4">
          <label className="block text-sm text-slate-600 mb-1">予約可能日数（何日先まで）</label>
          <input
            type="number"
            min={1}
            max={365}
            value={advanceDays}
            onChange={(e) => setAdvanceDays(parseInt(e.target.value) || 30)}
            className="w-32 px-3 py-2 border border-slate-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存"}
        </button>
      </form>
    </div>
  );
}
