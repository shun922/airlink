import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get("date");
  const resourceId = searchParams.get("resourceId");
  const status = searchParams.get("status");

  let query = supabase
    .from("reservations")
    .select("*, resources(name)")
    .order("date", { ascending: true })
    .order("start_time", { ascending: true });

  if (date) query = query.eq("date", date);
  if (resourceId) query = query.eq("resource_id", resourceId);
  if (status) query = query.eq("status", status);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const {
    resource_id,
    date,
    start_time,
    end_time,
    customer_name,
    customer_email,
    customer_phone,
    notes,
  } = body;

  if (!resource_id || !date || !start_time || !end_time || !customer_name) {
    return NextResponse.json(
      { error: "resource_id, date, start_time, end_time, customer_name are required" },
      { status: 400 }
    );
  }

  const { data: existing } = await supabase
    .from("reservations")
    .select("id, start_time, end_time")
    .eq("resource_id", resource_id)
    .eq("date", date)
    .eq("status", "confirmed");

  const overlaps = (existing || []).some(
    (r) =>
      (start_time < (r.end_time as string) && end_time > (r.start_time as string))
  );

  if (overlaps) {
    return NextResponse.json(
      { error: "この時間帯は既に予約されています" },
      { status: 409 }
    );
  }

  const { data, error } = await supabase
    .from("reservations")
    .insert({
      resource_id,
      date,
      start_time,
      end_time,
      customer_name,
      customer_email: customer_email || null,
      customer_phone: customer_phone || null,
      notes: notes || null,
      status: "confirmed",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
