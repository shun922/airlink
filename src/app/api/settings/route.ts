import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const key = searchParams.get("key");

  let query = supabase.from("settings").select("key, value, updated_at");

  if (key) {
    query = query.eq("key", key);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (key && data && data.length > 0) {
    return NextResponse.json(data[0]);
  }
  if (key && (!data || data.length === 0)) {
    return NextResponse.json({ error: "Setting not found" }, { status: 404 });
  }

  const settings: Record<string, unknown> = {};
  data?.forEach((r) => {
    settings[r.key] = r.value;
  });
  return NextResponse.json(settings);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const { key, value } = body;

  if (!key || value === undefined) {
    return NextResponse.json({ error: "key and value are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
