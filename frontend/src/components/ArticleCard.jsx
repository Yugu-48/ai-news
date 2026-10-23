// src/components/ArticleCard.jsx
// One news card. It only shows data it gets through props:
//   article, isSaved (true/false), onToggleSave (function from the parent page)
// No "use client" needed: it has no state of its own, and it is only used
// inside client pages, so the onClick works there.

export default function ArticleCard({ article, isSaved, onToggleSave }) {
  const date = new Date(article.publishedAt).toLocaleDateString();
  return (
    <article className="card">
      {/* use the article image, or the placeholder if it has none */}
      <img src={article.imageUrl || "/placeholder.svg"} alt="" />
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
