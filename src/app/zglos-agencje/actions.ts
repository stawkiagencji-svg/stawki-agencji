"use server";

import { headers } from "next/headers";
import { sign } from "@/lib/auth";
import { createSubmission, parseOfferForm } from "@/lib/offers";
import { SUBMITTER_ROLES } from "@/lib/types";

export type SubmitState = { error?: string; ok?: boolean; values?: Record<string, string | string[]>; n?: number };

const MIN_FILL_MS = 4000; // szybciej wypełniają tylko boty
const MAX_FILL_MS = 1000 * 60 * 60 * 24;

function formValues(form: FormData): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const k of new Set(form.keys())) {
    if (k.startsWith("$")) continue;
    out[k] = k === "contracts" ? form.getAll(k).map(String) : String(form.get(k));
  }
  return out;
}

export async function submitAgency(_: SubmitState, form: FormData): Promise<SubmitState> {
  const fail = (error: string) => ({ error, values: formValues(form), n: Date.now() });

  // Pułapka na boty: pole niewidoczne dla ludzi. Botowi udajemy sukces.
  if (String(form.get("company_url") ?? "")) return { ok: true, n: Date.now() };
  const [ts, mac] = String(form.get("t") ?? "").split(".");
  if (!ts || !mac || sign("form:" + ts) !== mac) return fail("Odśwież stronę i wyślij formularz ponownie.");
  const age = Date.now() - Number(ts);
  if (age < MIN_FILL_MS) return { ok: true, n: Date.now() };
  if (age > MAX_FILL_MS) return fail("Formularz wygasł. Odśwież stronę i wyślij go ponownie.");

  const role = String(form.get("role") ?? "");
  if (!(role in SUBMITTER_ROLES)) return fail("Zaznacz, kim jesteś.");
  if (form.get("truthful") !== "on") return fail("Potwierdź, że informacje są zgodne z Twoją wiedzą.");
  const email = String(form.get("email") ?? "").trim().slice(0, 200);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Sprawdź adres e-mail albo zostaw to pole puste.");
  if (email && form.get("consent") !== "on") return fail("Aby zostawić e-mail, zaznacz zgodę na kontakt.");

  const parsed = parseOfferForm(form);
  if (!parsed.ok) return fail(parsed.error);
  const date = new Date().toISOString().slice(0, 10);
  const offer = {
    ...parsed.offer,
    notes: [`Zgłoszenie z formularza (${SUBMITTER_ROLES[role as keyof typeof SUBMITTER_ROLES]}), ${date}.`, parsed.offer.notes]
      .filter(Boolean).join(" "),
  };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  const error = await createSubmission(offer, { role, email, ipHash: sign("ip:" + ip) });
  if (error) return fail(error);
  return { ok: true, n: Date.now() };
}
