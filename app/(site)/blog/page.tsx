import { allPosts } from 'contentlayer/generated'
import PostCard from '@/components/PostCard'
export const runtime = 'edge'
export default function BlogIndex(){
  const posts = allPosts.sort((a,b)=> +new Date(b.date) - +new Date(a.date))
  return <div className="grid md:grid-cols-2 gap-4">{posts.map(p=> <PostCard key={p.slug} post={p} />)}</div>
}
