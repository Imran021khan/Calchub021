import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  items: { label: string; path?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const location = useLocation();
  const isHindi = location.pathname.startsWith('/hi');

  return (
    <nav className="flex mb-6 text-sm text-zinc-500 overflow-x-auto whitespace-nowrap pb-2 md:pb-0" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to={isHindi ? "/hi" : "/"} className="hover:text-zinc-900 transition-colors flex items-center">
            <Home className="w-4 h-4" />
            <span className="sr-only">{isHindi ? "होम" : "Home"}</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
            {item.path ? (
              <Link to={item.path} className="hover:text-zinc-900 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-zinc-900 font-medium">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
