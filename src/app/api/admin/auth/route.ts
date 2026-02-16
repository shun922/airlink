import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_auth";
const SALT = "yoyaku-admin-2024";

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + SALT);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ noAuth: true }, { status: 200 });
  }

  const body = await request.json();
  const { password } = body;

  if (!password) {
    return NextResponse.json({ error: "パスワードを入力してください" }, { status: 400 });
  }

  const expectedHash = await hashPassword(adminPassword);
  const inputHash = await hashPassword(password);

  if (inputHash !== expectedHash) {
    return NextResponse.json({ error: "パスワードが正しくありません" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, expectedHash, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return NextResponse.json({ success: true });
}
