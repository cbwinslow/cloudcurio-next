import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export const runtime = 'edge'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <div className="flex items-center justify-center mb-8">
          <Image
            src="/octopus-mascot.png"
            alt="Purple Octopus Mascot"
            width={150}
            height={150}
          />
          <h1 className="text-6xl font-bold ml-4 text-white">
            Welcome to CloudCurio
          </h1>
        </div>

        <p className="mt-3 text-2xl text-gray-300">
          Your friendly guide to the cloud and beyond.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          <Link href="/blog" passHref>
            <Card className="hover:shadow-glow hover:border-primary transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle>Blog</CardTitle>
                <CardDescription>Read our latest articles</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Explore topics on AI, DevOps, and more.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/github" passHref>
            <Card className="hover:shadow-glow hover:border-primary transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle>GitHub</CardTitle>
                <CardDescription>See our code</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Check out our open-source projects.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/search" passHref>
            <Card className="hover:shadow-glow hover:border-primary transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle>Search</CardTitle>
                <CardDescription>Find what you're looking for</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Search our knowledge base and articles.</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/chat" passHref>
            <Card className="hover:shadow-glow hover:border-primary transition-all duration-300 cursor-pointer">
              <CardHeader>
                <CardTitle>Chat</CardTitle>
                <CardDescription>Talk to our AI assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Get your questions answered in real-time.</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}