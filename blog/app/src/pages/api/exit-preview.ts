import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // プレビューモードを無効化
  res.clearPreviewData()

  // トップページへリダイレクト
  res.redirect('/')
}
