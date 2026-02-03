"use client";

import { useState } from "react";

type BookItem = {
  itemId: number;
  title: string;
  author: string;
  publisher: string;
  cover: string;
  link: string;
  pages?: number | null;
};

export default function Home() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSearch = async () => {
    if (!q.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // ✅ API는 q 파라미터 사용
      const res = await fetch(`/api/aladin/search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      if (!data?.ok) {
        throw new Error(typeof data?.error === "string" ? data.error : "검색 실패");
      }

      // ✅ items가 배열 아닐 수도 있어 방어
      setItems(Array.isArray(data.items) ? data.items.filter(Boolean) : []);
    } catch (e: any) {
      setItems([]);
      setError(e?.message || "검색 오류");
    } finally {
      setLoading(false);
    }
  };

  const onAddToNotion = async (it?: BookItem) => {
    // ✅ undefined 방어 (이거 때문에 title 에러 났던 거)
    if (!it) {
      setError("책 정보가 비어있어요. 다시 검색해줘!");
      return;
    }

    setAddingId(it.itemId);
    setError(null);

    try {
      const res = await fetch("/api/notion/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: it.title ?? "",
          author: it.author ?? "",
          publisher: it.publisher ?? "",
          pages: it.pages ?? null,
          cover: it.cover ?? "",
          link: it.link ?? ""
        })
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        throw new Error(
          typeof data?.error === "string"
            ? data.error
            : data?.error?.message || "노션 등록 실패"
        );
      }
    } catch (e: any) {
      setError(e?.message || "노션 등록 오류");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 24,
        display: "flex",
        justifyContent: "center",
        background: "#f6f6f6"
      }}
    >
      <div style={{ width: "100%", maxWidth: 560 }}>
        <h1 style={{ fontSize: 18, fontWeight: 800, marginBottom: 12 }}>
          Notion Book Import
        </h1>

        {/* Search */}
        <div
          style={{
            background: "white",
            borderRadius: 18,
            padding: 14,
            border: "1px solid rgba(0,0,0,0.08)"
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
              placeholder="책 제목 검색 (예: 해리포터)"
              style={{
                flex: 1,
                height: 44,
                padding: "0 14px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                outline: "none",
                fontSize: 14
              }}
            />

            <button
              onClick={onSearch}
              disabled={loading}
              style={{
                height: 44,
                padding: "0 16px",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.12)",
                background: "black",
                color: "white",
                fontWeight: 700,
                cursor: "pointer",
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "..." : "Search"}
            </button>
          </div>

          {error ? (
            <div style={{ marginTop: 10, fontSize: 12, color: "crimson", whiteSpace: "pre-wrap" }}>
              {error}
            </div>
          ) : null}
        </div>

        {/* Results */}
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((it) => {
            // ✅ 커버 고화질: coversum -> cover500
            const coverHD = it.cover?.replace("/coversum/", "/cover500/") ?? it.cover;

            return (
              <div
                key={it.itemId}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: 12,
                  borderRadius: 16,
                  border: "1px solid rgba(0,0,0,0.08)",
                  background: "white"
                }}
              >
                <img
                  src={coverHD}
                  alt={it.title}
                  width={96}
                  height={132}
                  style={{
                    borderRadius: 12,
                    objectFit: "cover",
                    border: "1px solid rgba(0,0,0,0.08)",
                    flexShrink: 0
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, lineHeight: 1.3 }}>
                    {it.title}
                  </div>

                  <div style={{ marginTop: 6, fontSize: 12, opacity: 0.75, lineHeight: 1.4 }}>
                    <div>{it.author}</div>
                    <div>{it.publisher}</div>
                    {it.pages ? <div>{it.pages} pages</div> : null}
                  </div>

                  <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                    <a
                      href={it.link}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        padding: "7px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        border: "1px solid rgba(0,0,0,0.14)",
                        textDecoration: "none",
                        color: "black",
                        background: "transparent"
                      }}
                    >
                      알라딘 열기
                    </a>

                    <button
                      onClick={() => onAddToNotion(it)}
                      disabled={addingId === it.itemId}
                      style={{
                        padding: "7px 10px",
                        borderRadius: 999,
                        fontSize: 12,
                        border: "1px solid rgba(0,0,0,0.14)",
                        background: "black",
                        color: "white",
                        cursor: "pointer",
                        opacity: addingId === it.itemId ? 0.6 : 1
                      }}
                    >
                      {addingId === it.itemId ? "Adding..." : "노션에 추가"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
