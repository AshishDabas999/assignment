'use client';

import Navbar from '@/components/Navbar';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 flex flex-col items-center p-6">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mt-8 text-center bg-white shadow-xl rounded-2xl p-10">
        <h1 className="text-4xl font-bold mb-4">🛡️ Role-Based Access Control App</h1>
        <p className="text-gray-600 mb-6">
          Full-stack RBAC system using <strong>Next.js App Router</strong>, <strong>Prisma ORM</strong>, <strong>JWT Auth</strong>, and <strong>Tailwind CSS</strong>.
        </p>

        <div className="mt-4 text-left text-sm text-gray-500 w-full">
          <h3 className="font-semibold text-gray-800 mb-1">📌 Features:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Signup/Login using email & password (JWT stored in cookie)</li>
            <li>Role-based access control: <code>USER</code> and <code>ADMIN</code></li>
            <li>Protected routes using middleware</li>
            <li>CRUD for articles with ownership rules</li>
            <li>Admin dashboard to manage users and roles</li>
          </ul>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>🧪 Test users: <br />
            <code>admin@example.com / adminpass</code><br />
            <code>user@example.com / userpass</code>
          </p>
        </div>
      </div>
    </main>
  );
}
