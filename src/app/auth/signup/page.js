'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      router.push('/auth/login');
    } catch (err) {
      console.error('❌ Signup error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-200 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center text-emerald-600 mb-6">Create an Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition"
          >
            Sign Up
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-center text-red-600 font-medium">{error}</p>
        )}

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{' '}
          <a href="/auth/login" className="text-emerald-600 hover:underline font-medium">
            Log in here
          </a>
        </p>
      </div>
    </main>
  );
}
