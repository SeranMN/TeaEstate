import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Leaf, Users, Home, Calculator, Settings } from 'lucide-react';
import { clsx } from 'clsx';

const navigation = [
  { name: 'Dashboard', icon: Home, href: '/' },
  { name: 'Employees', icon: Users, href: '/employees' },
  { name: 'Tea Records', icon: Leaf, href: '/tea-records' },
  { name: 'Salary', icon: Calculator, href: '/salary' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-green-800 text-white p-6">
        <div className="flex items-center gap-2 mb-8">
          <Leaf className="h-8 w-8" />
          <h1 className="text-xl font-bold">Tea Estate Manager</h1>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={clsx(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                location.pathname === item.href
                  ? "bg-green-700 text-white"
                  : "hover:bg-green-700/50"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}