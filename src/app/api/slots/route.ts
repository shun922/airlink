import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function parseTime(timeStr: string): { hours: number; minutes: number } {
  const [h, m] = timeStr.split(":").map(Number);
  return { hours: h || 0, minutes: m || 0 };
}

function timeToMinutes(h: number, m: number): number {
  return h * 60 + m;
}

function minutesToTime(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");
  const resourceId = searchParams.get("resourceId");

  if (!date || !resourceId) {
    return NextResponse.json(
      { error: "date and resourceId are required" },
      { status: 400 }
    );
  }

  const { data: settingsRows } = await supabase
    .from("settings")
    .select("key, value")
    .in("key", ["business_hours", "slot_duration_minutes", "advance_booking_days"]);

  const settings: Record<string, unknown> = {};
  settingsRows?.forEach((r) => {
    settings[r.key] = r.value;
  });

  const businessHours = (settings.business_hours as { open?: string; close?: string }) || {
    open: "09:00",
    close: "18:00",
  };
  const slotDuration = (settings.slot_duration_minutes as number) ?? 30;
  const advanceDays = (settings.advance_booking_days as number) ?? 30;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const selectedDate = new Date(date + "T00:00:00");
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + advanceDays);

  if (selectedDate < today) {
    return NextResponse.json({ slots: [], message: "過去の日付は選択できません" });
  }
  if (selectedDate > maxDate) {
    return NextResponse.json({ slots: [], message: "予約可能日を超えています" });
  }

  const open = parseTime(businessHours.open || "09:00");
  const close = parseTime(businessHours.close || "18:00");
  const openMinutes = timeToMinutes(open.hours, open.minutes);
  const closeMinutes = timeToMinutes(close.hours, close.minutes);

  const slots: { start: string; end: string; available: boolean }[] = [];
  for (let m = openMinutes; m + slotDuration <= closeMinutes; m += slotDuration) {
    const start = minutesToTime(m);
    const end = minutesToTime(m + slotDuration);
    slots.push({ start, end, available: true });
  }

  const { data: reservations } = await supabase
    .from("reservations")
    .select("start_time, end_time")
    .eq("resource_id", resourceId)
    .eq("date", date)
    .eq("status", "confirmed");

  const bookedRanges = (reservations || []).map((r) => ({
    start: r.start_time as string,
    end: r.end_time as string,
  }));

  for (const slot of slots) {
    const slotStart = slot.start;
    const slotEnd = slot.end;
    const isBooked = bookedRanges.some(
      (b) =>
        (slotStart >= b.start && slotStart < b.end) ||
        (slotEnd > b.start && slotEnd <= b.end) ||
        (slotStart <= b.start && slotEnd >= b.end)
    );
    slot.available = !isBooked;
  }

  return NextResponse.json({ slots });
}
