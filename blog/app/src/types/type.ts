export type categorie = {
  id: string
  name: string
}

export type categories = categorie[]

export type article = {
  id: string
  title: string
  content: string
  publishedAt: string
  categories: categories
}

export type articles = article[]
