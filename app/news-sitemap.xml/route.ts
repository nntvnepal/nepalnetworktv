import { prisma } from "@/lib/prisma"

export async function GET() {

const articles = await prisma.article.findMany({
 where:{
  status:"approved",
  isDeleted:false
 },
 orderBy:{
  createdAt:"desc"
 },
 take:100,
 include:{
  category:true
 }
})

const baseUrl="https://www.nntvnepal.com"

const urls=articles.map(article=>`
<url>
 <loc>${baseUrl}/${article.category?.slug}/${article.slug}</loc>
 <news:news>
  <news:publication>
   <news:name>Nepal Network Television</news:name>
   <news:language>ne</news:language>
  </news:publication>
  <news:publication_date>${article.createdAt.toISOString()}</news:publication_date>
  <news:title><![CDATA[${article.title}]]></news:title>
 </news:news>
</url>
`).join("")

const xml=`<?xml version="1.0" encoding="UTF-8"?>
<urlset
 xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
 xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>`

return new Response(xml,{
 headers:{
  "Content-Type":"application/xml"
 }
})

}