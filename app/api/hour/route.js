import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const lines = [
  ["A quieter minute", "The street outside loses its hurry. Someone downstairs puts a kettle on and does not rush it."],
  ["What the window keeps", "Light slides one pane to the next. Nothing dramatic. That is the point."],
  ["A note left out", "If you marked it public it already belongs to the room. The private ones stay in the drawer."],
  ["Hour with no headline", "Sometimes the feature is only the clock moving and the paper staying warm."],
  ["After rain", "The air has that rinsed smell. Good hour to write something short and keep it."],
  ["Hands of the clock", "They do not argue. They just arrive."],
  ["Small inventory", "One chair. One desk. A wall of other people's sentences if they chose to share them."]
];

export async function GET(req) {
  const secret = process.env.CRON_SECRET || "";
  const given = req.headers.get("authorization") || new URL(req.url).searchParams.get("secret") || "";
  if (secret && given !== `Bearer ${secret}` && given !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabase = createClient(url, key);

  const pick = lines[new Date().getHours() % lines.length];
  const { error } = await supabase.from("hours").insert({
    slot: new Date().toISOString(),
    headline: pick[0],
    editorial: pick[1]
  });

  return NextResponse.json({ ok: !error, error: error?.message || null });
}
