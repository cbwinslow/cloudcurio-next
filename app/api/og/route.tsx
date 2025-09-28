import { ImageResponse } from '@vercel/og'
export const runtime='edge'
export async function GET(req:Request){
  const { searchParams } = new URL(req.url)
  const title = searchParams.get('title') || 'Cloudcurio'
  return new ImageResponse(
    (<div style={{ display:'flex', height:'100%', width:'100%', background:'#0b1114', color:'#18ff9b', alignItems:'center', justifyContent:'center', fontSize:64, fontWeight:700 }}> {title} </div>),
    { width: 1200, height: 630 }
  )
}
