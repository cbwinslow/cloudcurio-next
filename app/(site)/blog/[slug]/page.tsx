import { allPosts } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { Mdx } from '@/lib/mdx'
export const runtime = 'edge'
export default function PostPage({ params }: { params: { slug: string } }) {
  const post = allPosts.find(p => p.slug === params.slug)
  if (!post) return notFound()
  return (<article className="prose prose-invert max-w-none"><h1>{post.title}</h1><Mdx code={post.body.code} /></article>)
}
