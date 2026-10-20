"use client";

import { useState } from "react";
import { removeOffer } from "./actions";

export default function DeleteButton({ id, name }: { id: number; name: string }) {
  const [confirming, setConfirming] = useState(false);
  if (!confirming)
    return <button type="button" className="ghost danger" onClick={() => setConfirming(true)}>Usuń</button>;
  return (
    <form action={removeOffer}>
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="danger" aria-label={`Potwierdź usunięcie: ${name}`}>Na pewno usunąć?</button>{" "}
      <button type="button" className="ghost" onClick={() => setConfirming(false)}>Nie</button>
    </form>
  );
}
