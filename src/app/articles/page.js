"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/articles");
        if (res.ok) {
          const data = await res.json();
          setArticles(data.articles);
        }
      } catch (err) {
        console.error("❌ Error loading articles:", err);
      }
    };

    fetchArticles();
  }, []);

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📝 My Articles</h1>
      <Link
        href="/articles/new"
        className="text-blue-600 underline text-sm mb-4 block"
      >
        ➕ Create New Article
      </Link>

      {articles.length === 0 ? (
        <p className="text-gray-600">You have no articles yet.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map((article) => (
            <li key={article.id}>
              <Link
                href={`/articles/${article.id}`}
                className="block bg-white p-4 shadow rounded-lg hover:bg-gray-50 transition"
              >
                <h3 className="font-bold text-lg text-blue-700">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {article.content}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
