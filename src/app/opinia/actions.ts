"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { sign } from "@/lib/auth";
import { createReview, reportReview } from "@/lib/reviews";

export type ReviewState = { error?: string; ok?: boolean; values?: Record<string, string>; n?: number };

const MIN_FILL_MS = 8000; // szybciej wypełniają tylko boty
const MAX_FILL_MS = 1000 * 60 * 60 * 24;
const MIN_BODY = 30;

const text = (f: FormData, k: string, max: number) => String(f.get(k) ?? "").trim().slice(0, max);

async function ipHash(): Promise<string> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  return sign("ip:" + ip);
}

export async function submitReview(_: ReviewState, form: FormData): Promise<ReviewState> {
  const values = Object.fromEntries([...form.entries()].filter(([k]) => !k.startsWith("$")).map(([k, v]) => [k, String(v)]));
  const fail = (error: string) => ({ error, values, n: Date.now() });

  // Pułapka na boty: pole niewidoczne dla ludzi. Botowi udajemy sukces.
  if (text(form, "company_url", 10)) return { ok: true, n: Date.now() };
  const [ts, mac] = text(form, "t", 200).split(".");
  if (!ts || !mac || sign("review:" + ts) !== mac) return fail("Odśwież stronę i wyślij opinię ponownie.");
  const age = Date.now() - Number(ts);
  if (age < MIN_FILL_MS) return { ok: true, n: Date.now() };
  if (age > MAX_FILL_MS) return fail("Formularz wygasł. Odśwież stronę i wyślij opinię ponownie.");

  const rating = Number(form.get("rating"));
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return fail("Wybierz ocenę od 1 do 5 gwiazdek.");
  const body = text(form, "body", 2000);
  if (body.length < MIN_BODY) return fail(`Opisz swoje doświadczenie w co najmniej ${MIN_BODY} znakach.`);
  if (form.get("truthful") !== "on") return fail("Potwierdź, że opinia opisuje Twoje własne doświadczenie.");

  const error = await createReview({
    offerId: Number(form.get("offerId")),
    rating,
    nickname: text(form, "nickname", 40),
    worked: text(form, "worked", 40),
    body,
  }, await ipHash());
  if (error) return fail(error);
  return { ok: true, n: Date.now() };
}

export async function flagReview(form: FormData): Promise<void> {
  await reportReview(Number(form.get("id")));
  revalidatePath("/admin");
}
