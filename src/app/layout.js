// app/layout.js
import './globals.css';
import Navbar from '@/components/Navbar'; // adjust path as needed
export const metadata = {
  title: 'RBAC App',
  description: 'Role-based access control with Next.js',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
          <Navbar/>
          {children}
      </body>
    </html>
  );
}
