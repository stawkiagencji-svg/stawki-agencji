"use server";

import { headers } from "next/headers";
import { sign } from "@/lib/auth";
import { createOrder } from "@/lib/orders";
import { BILLING, PACKAGES, type Billing, type PackageKey } from "@/lib/packages";

export type OrderState = { error?: string; ok?: boolean; values?: Record<string, string>; n?: number };

const MIN_FILL_MS = 4000; // szybciej wypełniają tylko boty
const MAX_FILL_MS = 1000 * 60 * 60 * 24;

const text = (form: FormData, k: string, max: number) => String(form.get(k) ?? "").trim().slice(0, max);

export async function submitOrder(_: OrderState, form: FormData): Promise<OrderState> {
  const values: Record<string, string> = {};
  for (const k of new Set(form.keys())) if (!k.startsWith("$")) values[k] = String(form.get(k));
  const fail = (error: string) => ({ error, values, n: Date.now() });

  // Pułapka na boty: pole niewidoczne dla ludzi. Botowi udajemy sukces.
  if (String(form.get("company_url") ?? "")) return { ok: true, n: Date.now() };
  const [ts, mac] = String(form.get("t") ?? "").split(".");
  if (!ts || !mac || sign("order:" + ts) !== mac) return fail("Odśwież stronę i wyślij formularz ponownie.");
  const age = Date.now() - Number(ts);
  if (age < MIN_FILL_MS) return { ok: true, n: Date.now() };
  if (age > MAX_FILL_MS) return fail("Formularz wygasł. Odśwież stronę i wyślij go ponownie.");

  const pkg = String(form.get("package") ?? "");
  if (!(pkg in PACKAGES)) return fail("Wybierz pakiet: Standard albo Premium.");
  const billing = String(form.get("billing") ?? "monthly");
  if (!(billing in BILLING)) return fail("Wybierz sposób płatności.");
  const agency = text(form, "agency", 120);
  const company = text(form, "company", 200);
  const contactName = text(form, "contactName", 120);
  const email = text(form, "email", 200);
  const nip = text(form, "nip", 20).replace(/[\s-]/g, "");
  const applyUrl = text(form, "applyUrl", 500);
  if (!agency) return fail("Wpisz nazwę agencji.");
  if (!company) return fail("Wpisz nazwę firmy do rachunku.");
  if (!contactName) return fail("Wpisz imię i nazwisko osoby do kontaktu.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Sprawdź adres e-mail.");
  if (nip && !/^\d{10}$/.test(nip)) return fail("NIP powinien mieć 10 cyfr.");
  if (applyUrl && !/^https?:\/\//i.test(applyUrl)) return fail("Link do formularza powinien zaczynać się od https://");
  if (form.get("terms") !== "on") return fail("Zaakceptuj regulamin i politykę prywatności.");

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  const error = await createOrder({
    package: pkg as PackageKey, billing: billing as Billing, agency, company, nip, address: text(form, "address", 300), contactName,
    phone: text(form, "phone", 40), email, applyUrl, startDate: text(form, "startDate", 10), notes: text(form, "notes", 1000),
  }, sign("ip:" + ip));
  if (error) return fail(error);
  return { ok: true, n: Date.now() };
}
