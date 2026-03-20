'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-main flex-between py-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          ⛳ Golf Charity
        </Link>
        
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 hover:text-dark transition-colors">
            Login
          </Link>
          <Link href="/signup" className="btn-primary btn-sm">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
