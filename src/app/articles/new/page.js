'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewArticlePage() {
  const [form, setForm] = useState({ title: '', content: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setMessage('✅ Article created!');
        router.push('/articles');
      } else {
        setMessage('❌ Failed to create article');
      }
    } catch (err) {
      console.error('❌ Create article error:', err);
      setMessage('Error occurred');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Create New Article</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full border px-4 py-2 rounded-lg"
          />
          <textarea
            placeholder="Content"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            className="w-full border px-4 py-2 rounded-lg h-32"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Publish
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-green-600">{message}</p>}
      </div>
    </main>
  );
}
