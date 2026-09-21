"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase";

export default function Desk() {
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [mine, setMine] = useState([]);
  const [err, setErr] = useState("");

  async function load(uid) {
    const { data } = await supabase
      .from("notes")
      .select("id, title, body, is_public, created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false });
    setMine(data || []);
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      if (data.user) load(data.user.id);
    });
  }, []);

  async function save(e) {
    e.preventDefault();
    setErr("");
    if (!user) return;
    const { error } = await supabase.from("notes").insert({
      user_id: user.id,
      title: title.trim() || "Untitled",
      body: body.trim(),
      is_public: isPublic
    });
    if (error) setErr(error.message);
    else {
      setTitle("");
      setBody("");
      load(user.id);
    }
  }

  async function toggle(note) {
    await supabase.from("notes").update({ is_public: !note.is_public }).eq("id", note.id);
    load(user.id);
  }

  async function remove(id) {
    await supabase.from("notes").delete().eq("id", id);
    load(user.id);
  }

  if (!user) {
    return (
      <main className="hero">
        <h1>The desk is locked.</h1>
        <p className="lede"><a href="/login">Enter first</a>, then write.</p>
      </main>
    );
  }

  return (
    <main>
      <section className="hero">
        <div className="kicker">Your desk</div>
        <h1>Write something down.</h1>
      </section>
      <div className="panel">
        <form onSubmit={save}>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea placeholder="The note itself" value={body} onChange={(e) => setBody(e.target.value)} required />
          <label className="row" style={{ fontSize: 15 }}>
            <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
            Show this on the public wall
          </label>
          <button type="submit">Pin it</button>
          {err && <div className="err">{err}</div>}
        </form>
      </div>
      <div className="grid" style={{ marginTop: 22 }}>
        {mine.map((n) => (
          <article className="note" key={n.id}>
            <div className="meta">{n.is_public ? "Public" : "Private"} · {new Date(n.created_at).toLocaleString()}</div>
            <h3>{n.title}</h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{n.body}</p>
            <div className="row">
              <button type="button" onClick={() => toggle(n)}>
                {n.is_public ? "Make private" : "Make public"}
              </button>
              <button type="button" onClick={() => remove(n.id)} style={{ background: "transparent", color: "var(--accent)", border: "1px solid var(--line)" }}>Remove</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
