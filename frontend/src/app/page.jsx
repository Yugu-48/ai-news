// src/app/page.jsx  (home page: "/")
// "use client" is needed because this page uses state (useState), effects
// (useEffect), events (onClick/onChange) and localStorage (browser only).
"use client";

import { useState, useEffect } from "react";
import ArticleCard from "@/components/ArticleCard";

const MIN_SEARCH_LENGTH = 2;    // search text must have at least 2 characters
const SAVED_KEY = "savedArticles"; // name of the localStorage entry

export default function Home() {
  const [articles, setArticles] = useState([]);   // all articles from the API
  const [loading, setLoading] = useState(true);   // true while fetching
  const [error, setError] = useState("");         // error text, or ""
  const [search, setSearch] = useState("");       // text in the search box
  const [source, setSource] = useState("");       // chosen source ("" = all)
  const [saved, setSaved] = useState([]);         // saved articles

  // Ask our own API for the news (fetch + JSON)
  async function loadNews() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/news");
      if (!response.ok) throw new Error("Server answered " + response.status);
      setArticles(await response.json()); // JSON text -> JS array
    } catch (err) {
      setError("Could not load news. Please try again.");
    }
    setLoading(false);
  }

  // Runs once when the page opens: load news and read saved articles
  useEffect(() => {
    loadNews();
    setSaved(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"));
  }, []);

  // Save or un-save one article (stored in the browser's localStorage)
  function toggleSave(article) {
    const alreadySaved = saved.some((a) => a.id === article.id);
    const updated = alreadySaved
      ? saved.filter((a) => a.id !== article.id) // remove it
      : [...saved, article];                      // add it
    setSaved(updated);
    localStorage.setItem(SAVED_KEY, JSON.stringify(updated));
  }

  // Validation: trim spaces; a search of 1 character is not allowed
  const text = search.trim().toLowerCase();
  const searchTooShort = text.length > 0 && text.length < MIN_SEARCH_LENGTH;

  // Apply the source dropdown and the search box (array filter)
  const visible = articles
    .filter((a) => source === "" || a.source === source)
    .filter((a) => searchTooShort || (a.title + " " + a.summary).toLowerCase().includes(text));

  return (
    <section>
      <h1>Latest AI News</h1>

      {/* Search box, source dropdown and refresh button */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search news..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">All sources</option>
          <option value="Hacker News">Hacker News</option>
          <option value="TechCrunch">TechCrunch</option>
        </select>
        <button onClick={loadNews}>Refresh</button>
      </div>

      {/* Validation message */}
      {searchTooShort && (
        <p className="error">Type at least {MIN_SEARCH_LENGTH} characters to search.</p>
      )}

      {/* Conditional rendering: loading, error, empty, or the list */}
      {loading && <p>Loading news...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && visible.length === 0 && <p>No articles found.</p>}

      <div className="grid">
        {visible.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            isSaved={saved.some((a) => a.id === article.id)}
            onToggleSave={toggleSave}
          />
        ))}
      </div>
    </section>
  );
}
