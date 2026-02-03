import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const notionToken = process.env.NOTION_TOKEN!;
    const databaseId = process.env.NOTION_DATABASE_ID!;

    if (!notionToken || !databaseId) {
      return NextResponse.json(
        { ok: false, error: "Missing NOTION_TOKEN or NOTION_DATABASE_ID" },
        { status: 500 }
      );
    }

    const { book } = await req.json();

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          Title: { title: [{ text: { content: book.title ?? "" } }] },
          Author: { rich_text: [{ text: { content: book.author ?? "" } }] },
          Publisher: { rich_text: [{ text: { content: book.publisher ?? "" } }] },
          Pages: { rich_text: [{ text: { content: book.pages ? String(book.pages) : "" } }] },
          Link: { rich_text: [{ text: { content: book.link ?? "" } }] },
          Cover: {
            files: book.cover
              ? [{ name: "cover", type: "external", external: { url: book.cover } }]
              : []
          }
        }
      })
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: data }, { status: res.status });
    }

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? e }, { status: 500 });
  }
}
