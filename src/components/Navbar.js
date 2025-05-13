'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data.user);
      } catch {
        setUser(null); // not logged in
      }
    };
    fetchUser();
  }, []);

  // Handle logout and clear user state
  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to log out');
      setUser(null); // Clear user state instantly
      router.push('/'); // Redirect to homepage
    } catch (err) {
      console.error('❌ Logout failed:', err);
    }
  };

  // Handle login and set user state
  const handleLogin = (userData) => {
    setUser(userData); // Set the user state immediately after login
  };

  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">RBAC App</Link>
      <div className="space-x-4">
        {user ? (
          <>
            <Link href="/profile" className="text-blue-600 hover:underline">
              {user.name}
            </Link>
            <Link href="/articles" className="text-blue-600 hover:underline">
              My Articles
            </Link>
            {user.role === 'ADMIN' && (
              <Link href="/admin" className="text-red-600 hover:underline">
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login" className="text-blue-600 hover:underline">Login</Link>
            <Link href="/auth/signup" className="text-blue-600 hover:underline">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
