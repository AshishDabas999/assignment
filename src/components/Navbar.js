'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext'; // 👈 import global user hook

export default function Navbar() {
  const { user, setUser, loading } = useUser(); // 👈 use global state
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/logout', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to log out');
      setUser(null); // 👈 update global state
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('❌ Logout failed:', err);
    }
  };

  if (loading) {
    return null; // or a loading spinner if needed
  }

  return (
    <nav className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-blue-600">RBAC App</Link>
      
      <div className="space-x-4 text-sm font-medium flex items-center">
        {user ? (
          <>
            {(user.role === 'USER' ) && (
              <>
                <Link href="/articles" className="text-blue-600 hover:underline">📄 My Articles</Link>
                <Link href="/articles/new" className="text-green-600 hover:underline">✍️ New Article</Link>
                <Link href="/profile" className="text-blue-600 hover:underline">{user.name}</Link>
              </>
            )}

            {user.role === 'ADMIN' && (
              <>
                {/* <Link href="/admin" className="text-red-600 hover:underline">🛠️ Admin Dashboard</Link> */}
                <Link href="/admin/users" className="text-purple-600 hover:underline">👥 Manage Users</Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300"
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
