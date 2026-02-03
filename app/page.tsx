"use client";

import { useMemo, useState } from "react";

type BookItem = {
  itemId: number;
  title: string;
  author: string;
  publisher: string;
  cover: string;
  link: string;
  isbn13?: string;
  pages?: number | null;
};

export default function Page() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const canSearch = query.trim().length > 0;

  const onSearch = async () => {
    if (!canSearch) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/aladin/search?query=${encodeURIComponent(query.trim())}`);
      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error?.message || "검색 실패");
      }

      setItems(data.items || []);
    } catch (e: any) {
      setItems([]);
      setError(e?.message || "알 수 없는 오류");
    } finally {
      setLoading(false);
    }
  };

  const onAddToNotion = async (it: BookItem) => {
    setAddingId(it.itemId);
    setError(null);

    try {
      const res = await fetch("/api/notion/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: it.title,
          author: it.author,
          publisher: it.publisher,
          pages: it.pages ?? null,
          cover: it.cover,
          link: it.link
        })
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error?.message || "노션 등록 실패");
      }
    } catch (e: any) {
      setError(e?.message || "알 수 없는 오류");
    } finally {
      setAddingId(null);
    }
  };

  const heroSubtitle = useMemo(() => {
    return "Notion으로 가져오기";
  }, []);

  return (
    <main style={styles.page}>
      {/* Background grain */}
      <div style={styles.grain} />

      <section style={styles.shell}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerTop}>
            <div style={styles.badge}>Notion Book Import</div>
            <div style={styles.smallText}>{heroSubtitle}</div>
          </div>

          <h1 style={styles.title}>Exhibition Archive</h1>
          <p style={styles.desc}>
            알라딘에서 책을 검색하고, 노션 데이터베이스에{" "}
            <span style={{ fontWeight: 700 }}>표지/저자/출판사/링크</span>를 자동 저장해요.
          </p>
        </header>

        {/* Search Card */}
        <section style={styles.searchCard}>
          <div style={styles.searchRow}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
              placeholder="책 제목 검색 (예: 해리포터)"
              style={styles.input}
            />

            <button
              onClick={onSearch}
              disabled={!canSearch || loading}
              style={{
                ...styles.searchBtn,
                opacity: !canSearch || loading ? 0.5 : 1
              }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>

          {error ? <div style={styles.error}>{error}</div> : null}
        </section>

        {/* Results */}
        <section style={{ marginTop: 18 }}>
          <div style={styles.resultsTitleRow}>
            <div style={styles.resultsTitle}>Results</div>
            <div style={styles.resultsCount}>{items.length ? `${items.length} items` : ""}</div>
          </div>

          <div style={styles.resultsGrid}>
            {items.map((it) => {
              const coverHD = it.cover?.replace("/coversum/", "/cover500/") ?? it.cover;

              return (
                <article key={it.itemId} style={styles.card}>
                  <div style={styles.coverWrap}>
                    <img
                      src={coverHD}
                      alt={it.title}
                      width={104}
                      height={150}
                      style={styles.coverImg}
                    />
                    <div style={styles.coverShadow} />
                  </div>

                  <div style={styles.meta}>
                    <div style={styles.bookTitle} title={it.title}>
                      {it.title}
                    </div>

                    <div style={styles.subInfo}>
                      <div style={styles.subLine}>{it.author}</div>
                      <div style={styles.subLine}>{it.publisher}</div>
                      {it.pages ? <div style={styles.subLine}>{it.pages} pages</div> : null}
                    </div>

                    <div style={styles.actions}>
                      <a
                        href={it.link}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.linkBtn}
                      >
                        알라딘
                      </a>

                      <button
                        onClick={() => onAddToNotion(it)}
                        disabled={addingId === it.itemId}
                        style={{
                          ...styles.addBtn,
                          opacity: addingId === it.itemId ? 0.55 : 1
                        }}
                      >
                        {addingId === it.itemId ? "Adding..." : "노션에 추가"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    padding: 18,
    display: "flex",
    justifyContent: "center",
    background:
      "radial-gradient(1200px 700px at 20% 10%, rgba(255,255,255,0.20), rgba(0,0,0,0) 55%), radial-gradient(900px 520px at 80% 20%, rgba(255,255,255,0.10), rgba(0,0,0,0) 60%), linear-gradient(180deg, #0c0d0f 0%, #121417 55%, #0c0d0f 100%)",
    color: "#F2F3F5"
  },

  grain: {
    pointerEvents: "none",
    position: "fixed",
    inset: 0,
    opacity: 0.18,
    mixBlendMode: "overlay",
    backgroundImage:
      "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22200%22 height=%22200%22 filter=%22url(%23n)%22 opacity=%220.35%22/%3E%3C/svg%3E')"
  },

  shell: {
    width: "100%",
    maxWidth: 820
  },

  header: {
    padding: "6px 4px 14px"
  },

  headerTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10
  },

  badge: {
    fontSize: 12,
    letterSpacing: 0.7,
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.72)",
    padding: "7px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(10px)"
  },

  smallText: {
    fontSize: 12,
    opacity: 0.6
  },

  title: {
    margin: 0,
    fontSize: 32,
    letterSpacing: -0.6,
    lineHeight: 1.12
  },

  desc: {
    marginTop: 8,
    marginBottom: 0,
    fontSize: 13,
    lineHeight: 1.5,
    color: "rgba(242,243,245,0.78)"
  },

  searchCard: {
    marginTop: 14,
    borderRadius: 22,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.07)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
    backdropFilter: "blur(16px)",
    padding: 14
  },

  searchRow: {
    display: "flex",
    gap: 10,
    alignItems: "center"
  },

  input: {
    flex: 1,
    height: 44,
    borderRadius: 999,
    padding: "0 16px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(5,6,8,0.45)",
    color: "#F2F3F5",
    outline: "none",
    fontSize: 13
  },

  searchBtn: {
    height: 44,
    padding: "0 16px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.92)",
    color: "#0b0c0e",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer"
  },

  error: {
    marginTop: 10,
    fontSize: 12,
    padding: "9px 12px",
    borderRadius: 14,
    border: "1px solid rgba(255,120,120,0.25)",
    background: "rgba(255,70,70,0.08)",
    color: "rgba(255,205,205,0.96)"
  },

  resultsTitleRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "0 6px"
  },

  resultsTitle: {
    fontSize: 13,
    letterSpacing: 0.3,
    opacity: 0.85
  },

  resultsCount: {
    fontSize: 12,
    opacity: 0.55
  },

  resultsGrid: {
    marginTop: 10,
    display: "grid",
    gridTemplateColumns: "repeat(1, minmax(0, 1fr))",
    gap: 12
  },

  card: {
    display: "flex",
    gap: 14,
    padding: 14,
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    boxShadow: "0 20px 70px rgba(0,0,0,0.55)",
    backdropFilter: "blur(18px)"
  },

  coverWrap: {
    position: "relative",
    width: 104,
    height: 150,
    borderRadius: 18,
    overflow: "hidden",
    flexShrink: 0
  },

  coverImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 18,
    transform: "scale(1.02)"
  },

  coverShadow: {
    pointerEvents: "none",
    position: "absolute",
    inset: 0,
    borderRadius: 18,
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12), inset 0 -40px 70px rgba(0,0,0,0.6)"
  },

  meta: {
    flex: 1,
    minWidth: 0
  },

  bookTitle: {
    fontSize: 14,
    fontWeight: 800,
    letterSpacing: -0.2,
    lineHeight: 1.25,
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical"
  },

  subInfo: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 1.45,
    color: "rgba(242,243,245,0.70)"
  },

  subLine: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },

  actions: {
    display: "flex",
    gap: 10,
    marginTop: 12
  },

  linkBtn: {
    padding: "9px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(0,0,0,0.18)",
    color: "rgba(242,243,245,0.95)",
    textDecoration: "none",
    fontSize: 12
  },

  addBtn: {
    padding: "9px 12px",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.92)",
    color: "#0b0c0e",
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 12
  }
};
