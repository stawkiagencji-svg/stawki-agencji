"use client";

import { useActionState } from "react";
import { login, type FormState } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(login, {});
  return (
    <form action={action} className="panel login">
      <h2>Logowanie do panelu</h2>
      <label htmlFor="password">Hasło administratora</label>
      <input type="password" id="password" name="password" required autoComplete="current-password" />
      <button className="primary" type="submit" disabled={pending}>{pending ? "Sprawdzam…" : "Zaloguj"}</button>
      {state.error && <p className="msg err" role="alert">{state.error}</p>}
    </form>
  );
}
