import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "CloudCurio",
  description: "RAG + Agents + Crawler on Cloudflare"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-100">
        <header className="border-b border-neutral-800">
          <nav className="container mx-auto flex items-center justify-between p-4">
            <div className="font-bold tracking-wide">CloudCurio</div>
            <div className="flex gap-4 text-sm">
              <Link href="/">Home</Link>
              <Link href="/blog">Blog</Link>
              <Link href="/research">Deep Research</Link>
              <Link href="/chat">RAG Chat</Link>
              <Link href="/agents">Agents</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </nav>
        </header>
        <main className="container mx-auto p-6">{children}</main>
        <footer className="border-t border-neutral-800 mt-10 p-6 text-sm text-neutral-400">
          © {new Date().getFullYear()} cloudcurio.cc
        </footer>
      </body>
    </html>
  );
}
