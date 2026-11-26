import { pool } from "./db";
import type { OrderStatus, PackageKey } from "./packages";

export { FOUNDER_MONTHS, FOUNDER_SLOTS, FREE_FEATURES, ORDER_STATUSES, PACKAGES, TRIAL_DAYS } from "./packages";
export type { OrderStatus, PackageKey } from "./packages";

export type OrderInput = {
  package: PackageKey; agency: string; company: string; nip: string; address: string;
  contactName: string; phone: string; email: string; applyUrl: string; startDate: string; notes: string;
};
export type Order = OrderInput & { id: number; status: OrderStatus; date: string };

const ORDERS_PER_HOUR = 3;
const MAX_NEW_ORDERS = 200;

/** Zapisuje zamówienie. Zwraca komunikat błędu albo null. */
export async function createOrder(o: OrderInput, ipHash: string): Promise<string | null> {
  // Skróty adresów IP służą tylko do limitu zamówień; po 30 dniach je usuwamy.
  await pool.query("UPDATE orders SET ip_hash = NULL WHERE ip_hash IS NOT NULL AND created_at < now() - interval '30 days'");
  const { rows } = await pool.query<{ recent: number; pending: number }>(
    `SELECT count(*) FILTER (WHERE ip_hash = $1 AND created_at > now() - interval '1 hour')::int AS recent,
            count(*) FILTER (WHERE status = 'new')::int AS pending
     FROM orders`,
    [ipHash],
  );
  if (rows[0].recent >= ORDERS_PER_HOUR) return "Wysłano już kilka zamówień z tego urządzenia. Spróbuj ponownie za godzinę.";
  if (rows[0].pending >= MAX_NEW_ORDERS) return "Formularz jest chwilowo przepełniony. Napisz do nas e-mail.";
  await pool.query(
    `INSERT INTO orders (package, agency, company, nip, address, contact_name, phone, email, apply_url, start_date, notes, ip_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
    [o.package, o.agency, o.company, o.nip, o.address, o.contactName, o.phone, o.email, o.applyUrl, o.startDate, o.notes, ipHash],
  );
  return null;
}

/** Dla panelu: najpierw nowe, potem aktywne, na końcu zakończone; w każdej grupie najnowsze pierwsze. */
export async function listOrders(): Promise<Order[]> {
  const { rows } = await pool.query(
    `SELECT * FROM orders ORDER BY CASE status WHEN 'new' THEN 0 WHEN 'active' THEN 1 ELSE 2 END, created_at DESC`,
  );
  return rows.map((r) => ({
    id: r.id, package: r.package, agency: r.agency, company: r.company, nip: r.nip, address: r.address,
    contactName: r.contact_name, phone: r.phone, email: r.email, applyUrl: r.apply_url, startDate: r.start_date,
    notes: r.notes, status: r.status, date: (r.created_at as Date).toISOString().slice(0, 10),
  }));
}

export async function setOrderStatus(id: number, status: OrderStatus): Promise<void> {
  await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [status, id]);
}

export async function deleteOrder(id: number): Promise<void> {
  await pool.query("DELETE FROM orders WHERE id = $1", [id]);
}
