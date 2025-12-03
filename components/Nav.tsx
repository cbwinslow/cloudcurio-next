"use client";

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';

export default function Nav() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-transparent p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          CloudCurio
        </Link>
        <div className="flex items-center space-x-4">
          <Link href="/blog" className="text-lg text-gray-300 hover:text-white">
            Blog
          </Link>
          <Link href="/deep-research" className="text-lg text-gray-300 hover:text-white">
            Deep Research
          </Link>
          <Link href="/chat" className="text-lg text-gray-300 hover:text-white">
            Chat
          </Link>
          <Link href="/database" className="text-lg text-gray-300 hover:text-white">
            Database
          </Link>
          {status === "authenticated" && (
            <>
              <span className="text-white">|</span>
              <span className="text-lg text-gray-300">
                {session.user?.name || session.user?.email}
              </span>
              <Button onClick={() => signOut()} variant="destructive">
                Sign Out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}