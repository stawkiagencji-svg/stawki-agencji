"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, isAdmin, startSession } from "@/lib/auth";
import { createOffer, deleteOffer, parseOfferForm, updateOffer } from "@/lib/offers";

export type FormState = {
  error?: string;
  ok?: string;
  /** Wysłane wartości, żeby po błędzie walidacji pola nie znikały. */
  values?: Record<string, string | string[]>;
  /** Zmienia się przy każdej odpowiedzi; formularz używa go jako klucza. */
  n?: number;
};

function formValues(form: FormData): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  for (const k of new Set(form.keys())) {
    if (k.startsWith("$")) continue;
    out[k] = k === "contracts" ? form.getAll(k).map(String) : String(form.get(k));
  }
  return out;
}

export async function login(_: FormState, form: FormData): Promise<FormState> {
  if (!checkPassword(String(form.get("password") ?? ""))) {
    // Spowolnienie utrudnia zgadywanie hasła.
    await new Promise((r) => setTimeout(r, 1000));
    return { error: "Nieprawidłowe hasło." };
  }
  await startSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin");
}

export async function saveOffer(_: FormState, form: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { error: "Sesja wygasła. Zaloguj się ponownie.", values: formValues(form), n: Date.now() };
  const parsed = parseOfferForm(form);
  if (!parsed.ok) return { error: parsed.error, values: formValues(form), n: Date.now() };
  const id = Number(form.get("id"));
  if (id) await updateOffer(id, parsed.offer);
  else await createOffer(parsed.offer);
  revalidatePath("/");
  if (id) redirect("/admin?saved=1");
  return { ok: "Dodano ofertę.", n: Date.now() };
}

export async function removeOffer(form: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin");
  await deleteOffer(Number(form.get("id")));
  revalidatePath("/");
  revalidatePath("/admin");
}
