"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase";

export default function Home() {
  const [hour, setHour] = useState(null);
  const [notes, setNotes] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: hours } = await supabase
        .from("hours")
        .select("headline, editorial, slot")
        .order("slot", { ascending: false })
        .limit(1);
      setHour(hours?.[0] || null);

      const { data: publicNotes } = await supabase
        .from("notes")
        .select("id, title, body, created_at, profiles(handle, display_name)")
        .eq("is_public", true)
        .order("created_at", { ascending: false })
        .limit(24);
      setNotes(publicNotes || []);
    })();
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="kicker"><span className="tick" />This hour</div>
        <h1>The room keeps a clock.</h1>
        <p className="lede">
          Public notes live on the wall. Private ones stay at your desk.
          Every hour the headline changes.
        </p>
      </section>
      <article className="hour-card">
        <div className="kicker">Featured</div>
        <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, margin: "8px 0 10px" }}>
          {hour?.headline || "Waiting on the next turn of the hour."}
        </h2>
        <p style={{ margin: 0, color: "var(--ink-soft)", lineHeight: 1.5 }}>
          {hour?.editorial || "When the clock moves, something new is written here."}
        </p>
      </article>
      <div className="kicker" style={{ marginBottom: 12 }}>On the wall</div>
      <div className="grid">
        {notes.length === 0 && (
          <p className="lede">No public notes yet. Sign in and pin one.</p>
        )}
        {notes.map((n) => (
          <article className="note" key={n.id}>
            <div className="meta">
              {(n.profiles?.display_name || n.profiles?.handle || "someone")} · {new Date(n.created_at).toLocaleString()}
            </div>
            <h3>{n.title || "Untitled"}</h3>
            <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{n.body}</p>
          </article>
        ))}
      </div>
    </main>
  );
}
