"use client";

import { useState } from "react";
import { createClient } from "../../lib/supabase";

export default function Login() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [handle, setHandle] = useState("");
  const [mode, setMode] = useState("in");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setErr(error.message);
      else {
        setMsg("You are in.");
        window.location.href = "/desk";
      }
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setErr(error.message);
        return;
      }
      if (data.user) {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          handle: handle.replace(/[^a-z0-9_]/gi, "").slice(0, 24) || "guest",
          display_name: handle || "Guest"
        });
      }
      setMsg("Account ready. If email confirmation is on, check your inbox first.");
    }
  }

  return (
    <main>
      <section className="hero">
        <div className="kicker">Door</div>
        <h1>{mode === "in" ? "Come in." : "Take a key."}</h1>
      </section>
      <div className="panel">
        <form onSubmit={submit}>
          {mode === "up" && (
            <input placeholder="Handle" value={handle} onChange={(e) => setHandle(e.target.value)} required />
          )}
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <div className="row">
            <button type="submit">{mode === "in" ? "Enter" : "Create account"}</button>
            <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} style={{ background: "transparent", color: "var(--ink)", border: "1px solid var(--line)" }}>
              {mode === "in" ? "Need a key" : "I already have one"}
            </button>
          </div>
          {err && <div className="err">{err}</div>}
          {msg && <div className="ok">{msg}</div>}
        </form>
      </div>
    </main>
  );
}
