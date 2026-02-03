import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q) return NextResponse.json({ ok: false, error: "q is required" }, { status: 400 });

  const ttbkey = process.env.ALADIN_TTBKEY;
  if (!ttbkey) return NextResponse.json({ ok: false, error: "Missing ALADIN_TTBKEY" }, { status: 500 });

  const url = new URL("https://www.aladin.co.kr/ttb/api/ItemSearch.aspx");
  url.searchParams.set("ttbkey", ttbkey);
  url.searchParams.set("Query", q);
  url.searchParams.set("QueryType", "Title");
  url.searchParams.set("MaxResults", "10");
  url.searchParams.set("start", "1");
  url.searchParams.set("SearchTarget", "Book");
  url.searchParams.set("output", "js");
  url.searchParams.set("Version", "20131101");

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = await res.json();

  const items = (data.item ?? []).map((it: any) => ({
    title: it.title,
    author: it.author,
    publisher: it.publisher,
    cover: it.cover,
    link: it.link,
    itemId: it.itemId
  }));

  return NextResponse.json({ ok: true, items });
}
