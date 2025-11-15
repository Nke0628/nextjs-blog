import type { NextApiRequest, NextApiResponse } from 'next'

import { client } from '@/modules/client'
import { articles } from '@/types/type'

type Data = {
  contents: articles
  totalCount: number
}

type ErrorData = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | ErrorData>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { q } = req.query

  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Query parameter "q" is required' })
  }

  try {
    const data = await client.get({
      endpoint: 'articles',
      queries: {
        q: q.trim(),
      },
    })

    res.status(200).json({
      contents: data.contents,
      totalCount: data.totalCount,
    })
  } catch (error) {
    console.error('Search API error:', error)
    res.status(500).json({ error: 'Failed to search articles' })
  }
}
