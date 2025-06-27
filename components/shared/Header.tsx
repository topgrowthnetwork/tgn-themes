import Link from 'next/link';
import { ReactNode } from 'react';

interface HeaderProps {
  children?: ReactNode;
  className?: string;
}

export default function Header({ children, className = '' }: HeaderProps) {
  return (
    <header className={`bg-white shadow-sm ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-gray-900">
              Store
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden space-x-8 md:flex">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-600"
            >
              Home
            </Link>
            <Link
              href="/search"
              className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-600"
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="px-3 py-2 text-sm font-medium text-gray-900 hover:text-gray-600"
            >
              Cart
            </Link>
          </nav>

          {/* Right side content */}
          <div className="flex items-center space-x-4">{children}</div>
        </div>
      </div>
    </header>
  );
}
