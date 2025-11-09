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

export type technology = {
  name: string
  color: string
}

export type project = {
  id: string
  title: string
  description: string
  technologies: technology[]
  image?: string
  url?: string
  githubUrl?: string
}

export type projects = project[]
