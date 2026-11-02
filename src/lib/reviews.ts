import { pool } from "./db";
import type { AdminReview, Review } from "./types";

function fromRow(r: Record<string, unknown>): Review {
  return {
    id: r.id as number, offerId: r.offer_id as number, rating: r.rating as number, nickname: r.nickname as string,
    worked: r.worked as string, body: r.body as string, date: (r.created_at as Date).toISOString().slice(0, 10),
  };
}

/** Sprawdzone opinie, najnowsze pierwsze. */
export async function listPublishedReviews(): Promise<Review[]> {
  const { rows } = await pool.query(
    "SELECT r.* FROM reviews r JOIN offers o ON o.id = r.offer_id WHERE r.published AND o.published ORDER BY r.created_at DESC",
  );
  return rows.map(fromRow);
}

/** Dla panelu: najpierw zgłoszone naruszenia, potem nowe, potem opublikowane. */
export async function listAllReviews(): Promise<AdminReview[]> {
  const { rows } = await pool.query(
    `SELECT r.*, o.name AS offer_name FROM reviews r JOIN offers o ON o.id = r.offer_id
     ORDER BY r.reported DESC, r.published, r.created_at DESC`,
  );
  return rows.map((r) => ({ ...fromRow(r), offerName: r.offer_name, published: r.published, reported: r.reported }));
}

const REVIEWS_PER_HOUR = 3;
const MAX_PENDING_REVIEWS = 500;

export type ReviewInput = { offerId: number; rating: number; nickname: string; worked: string; body: string };

/** Zapisuje opinię do sprawdzenia. Zwraca komunikat błędu albo null. */
export async function createReview(r: ReviewInput, ipHash: string): Promise<string | null> {
  await pool.query("UPDATE reviews SET ip_hash = NULL WHERE ip_hash IS NOT NULL AND created_at < now() - interval '30 days'");
  const { rows } = await pool.query<{ recent: number; pending: number; offer: number }>(
    `SELECT count(*) FILTER (WHERE ip_hash = $1 AND created_at > now() - interval '1 hour')::int AS recent,
            count(*) FILTER (WHERE NOT published)::int AS pending,
            (SELECT count(*)::int FROM offers WHERE id = $2 AND published) AS offer
     FROM reviews`,
    [ipHash, r.offerId],
  );
  if (!rows[0].offer) return "Nie znaleziono tej agencji.";
  if (rows[0].recent >= REVIEWS_PER_HOUR) return "Wysłano już kilka opinii z tego urządzenia. Spróbuj ponownie za godzinę.";
  if (rows[0].pending >= MAX_PENDING_REVIEWS) return "Formularz jest chwilowo przepełniony. Spróbuj ponownie za kilka dni.";
  await pool.query(
    "INSERT INTO reviews (offer_id, rating, nickname, worked, body, ip_hash) VALUES ($1, $2, $3, $4, $5, $6)",
    [r.offerId, r.rating, r.nickname, r.worked, r.body, ipHash],
  );
  return null;
}

/** Zgłoszenie naruszenia przez czytelnika. Opinia zostaje na stronie, dopóki administrator jej nie sprawdzi,
 *  żeby nikt nie mógł jednym kliknięciem ukryć niewygodnej opinii. */
export async function reportReview(id: number): Promise<void> {
  await pool.query("UPDATE reviews SET reported = TRUE WHERE id = $1 AND published", [id]);
}

export async function setReviewPublished(id: number, published: boolean): Promise<void> {
  await pool.query("UPDATE reviews SET published = $1, reported = FALSE WHERE id = $2", [published, id]);
}

export async function deleteReview(id: number): Promise<void> {
  await pool.query("DELETE FROM reviews WHERE id = $1", [id]);
}
