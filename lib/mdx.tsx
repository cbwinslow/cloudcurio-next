import * as runtime from 'react/jsx-runtime'
import { useMDXComponent } from 'next-contentlayer/hooks'
import GistEmbed from '@/components/GistEmbed'
const components = { Gist: GistEmbed }
export function Mdx({ code }: { code: string }) {
  const Component = useMDXComponent(code)
  return <Component components={components as any} />
}
