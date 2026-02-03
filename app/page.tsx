"use client";

import { useState } from "react";

type Item = {
  title: string;
  author: string;
  publisher: string;
  cover: string;
  link: string;
  itemId: number;
};

export default function Home() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string>("");

  const search = async () => {
    setMsg("");
    if (!q.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/aladin/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Search failed");
      setItems(data.items);
    } catch (e: any) {
      setMsg(e.message ?? "Error");
    } finally {
      setLoading(false);
    }
  };

  const addToNotion = async (it: Item) => {
    setMsg("");
    try {
      const detailRes = await fetch(`/api/aladin/detail?itemId=${it.itemId}`);
      const detailData = await detailRes.json();
      const pages = detailData?.pages;

      const res = await fetch("/api/notion/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          book: {
            title: it.title,
            author: it.author,
            publisher: it.publisher,
            pages,
            cover: it.cover,
            link: it.link
          }
        })
      });

      const data = await res.json();
      if (!data.ok) throw new Error("Notion 등록 실패");
      setMsg("✅ 노션에 추가 완료!");
    } catch (e: any) {
      setMsg(e.message ?? "Error");
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: 16 }}>
      <div
        style={{
          background: "white",
          borderRadius: 18,
          padding: 16,
          border: "1px solid #eee",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)"
        }}
      >
        <div style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>Notion Book Import</div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="책 제목 검색 (예: 해리포터)"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderRadius: 12,
              border: "1px solid #ddd",
              outline: "none"
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") search();
            }}
          />
          <button
            onClick={search}
            style={{
              padding: "10px 14px",
              borderRadius: 12,
              border: "1px solid #111",
              background: "#111",
              color: "white",
              cursor: "pointer"
            }}
          >
            {loading ? "..." : "Search"}
          </button>
        </div>

        {msg && <div style={{ marginTop: 12, fontSize: 13 }}>{msg}</div>}

        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          {items.map((it) => (
            <div
              key={it.itemId}
              style={{
                display: "flex",
                gap: 10,
                padding: 10,
                borderRadius: 14,
                border: "1px solid #eee",
                background: "#fff"
              }}
            >
              <img
                const coverHD = it.cover?.replace("/coversum/", "/cover500/");

<img
  src={coverHD}
  alt={it.title}
  width={80}
  height={112}
  style={{ borderRadius: 12, objectFit: "cover", border: "1px solid #eee" }}
/>
                alt={it.title}
                width={52}
                height={72}
                style={{ borderRadius: 10, objectFit: "cover", border: "1px solid #eee" }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.3 }}>{it.title}</div>
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{it.author}</div>
                <div style={{ fontSize: 12, opacity: 0.6 }}>{it.publisher}</div>

                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <a
                    href={it.link}
                    target="_blank"
                    style={{ fontSize: 12, textDecoration: "underline", opacity: 0.85 }}
                  >
                    알라딘 링크
                  </a>
                  <button
                    onClick={() => addToNotion(it)}
                    style={{
                      marginLeft: "auto",
                      padding: "6px 10px",
                      borderRadius: 10,
                      border: "1px solid #111",
                      background: "white",
                      cursor: "pointer",
                      fontSize: 12
                    }}
                  >
                    노션에 추가
                  </button>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div style={{ fontSize: 12, opacity: 0.6, padding: "8px 2px" }}>
              검색하면 결과가 여기에 표시돼.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
