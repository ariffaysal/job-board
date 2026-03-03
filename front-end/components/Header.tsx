'use client';

import { useState, useEffect } from 'react';

export default function Header() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="navbar bg-white shadow-md sticky top-0 z-50">
      <div className="flex-1">
        <label htmlFor="my-drawer" className="btn btn-ghost drawer-button lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </label>
        <h1 className="text-xl font-bold text-gray-800 ml-4">
          Agency Management System
        </h1>
      </div>
      
      <div className="flex-none gap-2">
        {user && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-blue-600 text-white rounded-full w-10">
                <span className="text-xl">{user.name?.charAt(0).toUpperCase()}</span>
              </div>
            </label>
            <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-white rounded-box w-52 border">
              <li className="menu-title">
                <span className="text-gray-600">Logged in as</span>
              </li>
              <li><a className="font-bold text-gray-800">{user.name}</a></li>
              <li><a className="text-gray-600">{user.email}</a></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}