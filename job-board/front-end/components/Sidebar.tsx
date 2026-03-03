

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/agencies', label: 'Agencies', icon: '🏢' },
    { href: '/agencies/add', label: 'Add Agency', icon: '➕' },
    { href: '/clients', label: 'Clients', icon: '👥' },
    { href: '/jobs', label: 'Jobs', icon: '💼' },
  ];

  return (
    <div className="drawer-side">
      <label htmlFor="my-drawer" className="drawer-overlay"></label>
      <div className="w-64 min-h-full bg-gradient-to-b from-blue-600 to-blue-800 text-white">
        {/* Logo/Brand */}
        <div className="p-4 bg-blue-900">
          <h2 className="text-2xl font-bold text-center">Agency System</h2>
          {user && (
            <p className="text-sm text-center text-blue-200 mt-2">
              Welcome, {user.name}
            </p>
          )}
        </div>

        {/* Menu Items */}
        <ul className="menu p-4 space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  pathname === item.href
                    ? 'bg-white text-blue-600 font-bold shadow-lg'
                    : 'hover:bg-blue-700'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-lg">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="absolute bottom-4 left-4 right-4">
          <button
            onClick={handleLogout}
            className="btn btn-error w-full text-white"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}