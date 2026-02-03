{/* 검색 결과 */}
<div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
  {items.map((it) => {
    const coverHD = it.cover?.replace("/coversum/", "/cover500/") ?? it.cover;

    return (
      <div
        key={it.itemId}
        style={{
          display: "flex",
          gap: 12,
          padding: 12,
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.06)",
          background: "rgba(255,255,255,0.92)"
        }}
      >
        <img
          src={coverHD}
          alt={it.title}
          width={80}
          height={112}
          style={{
            borderRadius: 12,
            objectFit: "cover",
            border: "1px solid rgba(0,0,0,0.08)",
            flexShrink: 0
          }}
        />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>
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
              style={{
                padding: "7px 10px",
                borderRadius: 999,
                fontSize: 12,
                border: "1px solid rgba(0,0,0,0.14)",
                background: "black",
                color: "white",
                cursor: "pointer"
              }}
            >
              노션에 추가
            </button>
          </div>
        </div>
      </div>
    );
  })}
</div>
