'use client';

import { useEffect, useState } from 'react';

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      } else {
        setMessage(data.error);
      }
    } catch (err) {
      console.error('❌ Error loading users:', err);
      setMessage('Error loading users.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleRole = async (userId, currentRole) => {
    const newRole = currentRole === 'USER' ? 'ADMIN' : 'USER';
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, newRole }),
      });

      if (res.ok) {
        setMessage('✅ Role updated!');
        fetchUsers(); // refresh list
      } else {
        const err = await res.json();
        setMessage(err.error || 'Error updating role');
      }
    } catch (err) {
      console.error('❌ Role change error:', err);
      setMessage('Request failed');
    }
  };

  const deleteUser = async (userId) => {
    const confirmation = window.confirm('Are you sure you want to delete this user?');
    if (!confirmation) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (res.ok) {
        setMessage('✅ User deleted successfully');
        fetchUsers(); // refresh list after deletion
      } else {
        const err = await res.json();
        setMessage(err.error || 'Error deleting user');
      }
    } catch (err) {
      console.error('❌ Deletion error:', err);
      setMessage('Request failed');
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">🛠️ Manage User Roles</h1>
      {message && <p className="text-sm mb-4 text-red-600">{message}</p>}

      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Role</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="text-center">
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">{u.email}</td>
                <td className="p-2 border">{u.role}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => toggleRole(u.id, u.role)}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Make {u.role === 'USER' ? 'Admin' : 'User'}
                  </button>
                  <button
                    onClick={() => deleteUser(u.id)}
                    className="ml-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
