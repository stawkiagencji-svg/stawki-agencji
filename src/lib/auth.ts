import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { DATABASE_URL } from "./env";

const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 godzin

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 32) return s;
  // Bez SESSION_SECRET wyprowadzamy klucz z hasła admina i adresu bazy (zawiera losowe hasło bazy),
  // żeby wdrożenie wymagało jak najmniej ustawień. Zmiana hasła admina wylogowuje wszystkie sesje.
  const pw = process.env.ADMIN_PASSWORD, db = DATABASE_URL;
  if (!pw || !db) throw new Error("Ustaw ADMIN_PASSWORD i DATABASE_URL (albo SESSION_SECRET) w zmiennych środowiskowych.");
  return createHash("sha256").update(`stawki-agencji:${pw}:${db}`).digest("hex");
}

export const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("hex");

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a), bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || expected.length < 12) return false;
  // Porównujemy skróty, żeby długość hasła nie wyciekała przez czas odpowiedzi.
  return safeEqual(sign("pw:" + input), sign("pw:" + expected));
}

export async function startSession(): Promise<void> {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const value = (await cookies()).get(COOKIE)?.value;
  if (!value) return false;
  const [exp, mac] = value.split(".");
  if (!exp || !mac || !safeEqual(mac, sign(exp))) return false;
  return Number(exp) > Date.now() / 1000;
}
