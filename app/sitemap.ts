import { prisma } from "@/lib/prisma"
import { MetadataRoute } from "next"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  const baseUrl = "https://www.nntvnepal.com"

  const articles = await prisma.article.findMany({
    where:{
      status:"approved",
      isDeleted:false
    },
    include:{ category:true }
  })

  const urls = articles.map(a => ({
    url: `${baseUrl}/${a.category?.slug}/${a.slug}`,
    lastModified: a.updatedAt || a.createdAt
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date()
    },
    ...urls
  ]

}