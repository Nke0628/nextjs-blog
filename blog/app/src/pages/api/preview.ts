import type { NextApiRequest, NextApiResponse } from 'next'

import { client } from '@/modules/client'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { contentId, draftKey } = req.query

  // パラメータのバリデーション
  if (!contentId || typeof contentId !== 'string') {
    return res.status(401).json({ message: 'Invalid contentId' })
  }

  if (!draftKey || typeof draftKey !== 'string') {
    return res.status(401).json({ message: 'Invalid draftKey' })
  }

  // 下書きコンテンツが存在するか確認
  try {
    await client.get({
      endpoint: 'articles',
      contentId: contentId,
      queries: { draftKey: draftKey },
    })
  } catch (error) {
    return res.status(401).json({ message: 'Invalid draft key or content not found' })
  }

  // プレビューモードを有効化
  res.setPreviewData({
    contentId,
    draftKey,
  })

  // 記事詳細ページへリダイレクト
  res.redirect(`/articles/${contentId}`)
}
