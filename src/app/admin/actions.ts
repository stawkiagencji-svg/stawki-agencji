"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { checkPassword, endSession, isAdmin, startSession } from "@/lib/auth";
import { createOffer, deleteOffer, LOGO_MAX_BYTES, parseOfferForm, setOfferLogo, updateOffer } from "@/lib/offers";
import { deleteReview, setReviewPublished, setReviewReply } from "@/lib/reviews";

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
    if (k.startsWith("$") || k === "logo") continue;
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

// Rozpoznajemy format po pierwszych bajtach pliku, a nie po tym, co deklaruje przeglądarka.
function imageType(b: Buffer): string | null {
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "image/png";
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b.subarray(0, 4).toString("latin1") === "RIFF" && b.subarray(8, 12).toString("latin1") === "WEBP") return "image/webp";
  return null;
}

/** Logo z formularza: dane obrazka, null gdy nie wybrano pliku, albo komunikat błędu. */
async function readLogo(file: FormDataEntryValue | null): Promise<{ data: Buffer; type: string } | null | string> {
  // Sprawdzamy kształt, a nie klasę: plik z formularza nie zawsze jest instancją globalnego File.
  if (!file || typeof file === "string" || file.size === 0) return null;
  if (file.size > LOGO_MAX_BYTES) return "Logo jest za duże. Maksymalnie 300 KB.";
  const data = Buffer.from(await file.arrayBuffer());
  const type = imageType(data);
  return type ? { data, type } : "Logo musi być plikiem PNG, JPG albo WEBP.";
}

export async function saveOffer(_: FormState, form: FormData): Promise<FormState> {
  if (!(await isAdmin())) return { error: "Sesja wygasła. Zaloguj się ponownie.", values: formValues(form), n: Date.now() };
  const parsed = parseOfferForm(form);
  if (!parsed.ok) return { error: parsed.error, values: formValues(form), n: Date.now() };
  const logo = await readLogo(form.get("logo"));
  if (typeof logo === "string") return { error: logo, values: formValues(form), n: Date.now() };
  let id = Number(form.get("id"));
  if (id) await updateOffer(id, parsed.offer);
  else id = await createOffer(parsed.offer);
  if (logo) await setOfferLogo(id, logo);
  else if (form.get("removeLogo") === "on") await setOfferLogo(id, null);
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

export async function moderateReview(form: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin");
  const id = Number(form.get("id"));
  const action = String(form.get("action"));
  if (action === "delete") await deleteReview(id);
  else await setReviewPublished(id, action === "publish");
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function replyToReview(form: FormData): Promise<void> {
  if (!(await isAdmin())) redirect("/admin");
  await setReviewReply(Number(form.get("id")), String(form.get("reply") ?? "").trim().slice(0, 2000));
  revalidatePath("/");
  revalidatePath("/admin");
}
