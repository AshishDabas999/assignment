'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function SingleArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) throw new Error('Failed to load article');
        const data = await res.json();
        setArticle(data.article);
      } catch (err) {
        console.error(err);
        setError('Unable to load article.');
      }
    };

    fetchArticle();
  }, [id]);

  if (error) return <p className="p-6 text-red-600 text-center">{error}</p>;
  if (!article) return <p className="p-6 text-center">Loading...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-blue-700">{article.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        ✍️ {article.author.name} | 🗓️ {new Date(article.createdAt).toLocaleDateString()}
      </p>
      <div className="bg-white p-6 shadow rounded-lg text-gray-800 whitespace-pre-wrap">
        {article.content}
      </div>
    </main>
  );
}
