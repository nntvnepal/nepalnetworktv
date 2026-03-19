import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {

  return {
    rules:{
      userAgent:"*",
      allow:"/"
    },
    sitemap:[
      "https://www.nntvnepal.com/sitemap.xml",
      "https://www.nntvnepal.com/news-sitemap.xml"
    ]
  }

}