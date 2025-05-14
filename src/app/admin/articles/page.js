'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch articles from the API on component mount
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/admin/articles');
        if (!res.ok) {
          setError('Failed to fetch articles.');
          return;
        }
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error('❌ Error fetching articles:', err);
        setError('Failed to fetch articles.');
      }
    };

    fetchArticles();
  }, []);

  const handleDeleteArticle = async (articleId) => {
    const res = await fetch(`/api/admin/article/${articleId}`, {
      method: 'DELETE',
    });

    const data = await res.json();
    if (res.ok) {
      setArticles(articles.filter(article => article.id !== articleId)); // Remove deleted article from state
      alert(data.message);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Articles</h1>
      
      {error && <p className="text-red-600">{error}</p>}

      <div className="space-y-4">
        {articles.length === 0 ? (
          <p>No articles available</p>
        ) : (
          articles.map((article) => (
            <div key={article.id} className="p-4 border rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{article.title}</h2>
              <p className="text-sm text-gray-600">{article.content}</p>
              <div className="mt-4 flex justify-between items-center">
                <button
                  onClick={() => handleDeleteArticle(article.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete Article
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
