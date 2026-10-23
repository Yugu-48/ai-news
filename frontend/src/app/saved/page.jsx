// src/app/saved/page.jsx  (saved page: "/saved")
// "use client" is needed because it reads localStorage (browser only)
// and uses state and click events.
"use client";

import { useState, useEffect } from "react";
import ArticleCard from "@/components/ArticleCard";

const SAVED_KEY = "savedArticles"; // same name the home page uses

export default function Saved() {
  const [saved, setSaved] = useState([]);

  // Runs once when the page opens: read saved articles from localStorage
  useEffect(() => {
    setSaved(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"));
  }, []);

  // Remove one article and store the new list
  function removeArticle(article) {
    const updated = saved.filter((a) => a.id !== article.id);
    setSaved(updated);
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
  }

  return (
    <section>
      <h1>Saved Articles</h1>
      {saved.length === 0 && <p>Nothing saved yet. Press "Save" on the home page.</p>}
      <div className="grid">
        {saved.map((article) => (
          <ArticleCard key={article.id} article={article} isSaved={true} onToggleSave={removeArticle} />
        ))}
      </div>
    </section>
  );
}
