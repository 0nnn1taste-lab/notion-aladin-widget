import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("itemId")?.trim();

  if (!itemId) return NextResponse.json({ ok: false, error: "itemId is required" }, { status: 400 });

  const ttbkey = process.env.ALADIN_TTBKEY;
  if (!ttbkey) return NextResponse.json({ ok: false, error: "Missing ALADIN_TTBKEY" }, { status: 500 });

  const url = new URL("https://www.aladin.co.kr/ttb/api/ItemLookUp.aspx");
  url.searchParams.set("ttbkey", ttbkey);
  url.searchParams.set("itemIdType", "ItemId");
  url.searchParams.set("ItemId", itemId);
  url.searchParams.set("output", "js");
  url.searchParams.set("Version", "20131101");

  const res = await fetch(url.toString(), { cache: "no-store" });
  const data = await res.json();

  const subInfo = data?.item?.[0]?.subInfo ?? {};
  const pages = typeof subInfo?.itemPage === "number" ? subInfo.itemPage : undefined;

  return NextResponse.json({ ok: true, pages });
}
