// src/components/ArticleCard.jsx
// One news card. It only shows data it gets through props:
//   article, isSaved (true/false), onToggleSave (function from the parent page)
// No "use client" needed: it has no state of its own, and it is only used
// inside client pages, so the onClick works there.

export default function ArticleCard({ article, isSaved, onToggleSave }) {
  const date = new Date(article.publishedAt).toLocaleDateString();
  // Only http/https images (saved articles come from localStorage, so check again here)
  const hasImage = /^https?:\/\//i.test(article.imageUrl || "");
  return (
    <article className="card">
      {/* article image, or the placeholder if it has none or it fails to load */}
      <img
        src={hasImage ? article.imageUrl : "/placeholder.svg"}
        alt={hasImage ? article.title : ""}
        loading="lazy"
        onError={(e) => {
          if (!e.currentTarget.src.endsWith("/placeholder.svg")) {
            e.currentTarget.src = "/placeholder.svg";
            e.currentTarget.alt = "";
          }
        }}
      />
      <div className="card-body">
        <p className="meta">
          {article.source} · {date}
        </p>
        <h2>
          {/* link out to the publisher's site */}
          <a href={article.url} target="_blank" rel="noreferrer">
            {article.title}
          </a>
        </h2>
        <p>{article.summary}</p>
        <button onClick={() => onToggleSave(article)}>
          {isSaved ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </article>
  );
}
