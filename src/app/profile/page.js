'use client';

import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();
        setUser(data.user);
        setName(data.user.name);
      } catch (err) {
        console.error('❌ Failed to load profile:', err);
      }
    };
    fetchUser();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Name updated successfully!');
        setUser(data.user);
      } else {
        throw new Error(data.error || 'Failed to update');
      }
    } catch (err) {
      console.error('❌ Update error:', err);
      setMessage('❌ Failed to update name.');
    }
  };

  if (!user) {
    return <p className="p-6 text-center text-red-600">You must be logged in to view this page.</p>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-blue-600 mb-6">👤 Profile</h2>

        <p className="mb-4"><strong>Email:</strong> {user.email}</p>
        <p className="mb-6"><strong>Role:</strong> <span className="text-blue-600 font-semibold">{user.role}</span></p>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Update Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Save
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-center text-green-600 font-medium">{message}</p>
        )}
      </div>
    </main>
  );
}
