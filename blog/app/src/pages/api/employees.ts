import type { NextApiRequest, NextApiResponse } from 'next'

type Employee = {
  id: string
  name: string
  department: string
  score: number
  avatar: string
  position: string
  joinDate: string
}

// テストデータ生成関数（本番ではDBから取得）
const generateEmployees = (count: number): Employee[] => {
  const departments = [
    '営業部',
    '開発部',
    '人事部',
    '総務部',
    'マーケティング部',
    '企画部',
    '財務部',
    '法務部',
    '広報部',
    'カスタマーサポート部',
    '製造部',
    '品質管理部',
    '物流部',
    '購買部',
    '研究開発部',
    'IT部',
    'デザイン部',
    '経営企画部',
    '内部監査部',
    '事業開発部',
  ]

  const positions = [
    '部長',
    '課長',
    '主任',
    '係長',
    'リーダー',
    'マネージャー',
    'シニアスタッフ',
    'スタッフ',
    'ジュニアスタッフ',
  ]

  const avatars = [
    '👨‍💼',
    '👩‍💼',
    '👨‍💻',
    '👩‍💻',
    '👨‍🔧',
    '👩‍🔧',
    '👨‍🎨',
    '👩‍🎨',
    '👨‍🏫',
    '👩‍🏫',
    '👨‍⚕️',
    '👩‍⚕️',
  ]

  const lastNames = [
    '佐藤',
    '鈴木',
    '高橋',
    '田中',
    '伊藤',
    '渡辺',
    '山本',
    '中村',
    '小林',
    '加藤',
    '吉田',
    '山田',
    '佐々木',
    '山口',
    '松本',
    '井上',
    '木村',
    '林',
    '斎藤',
    '清水',
  ]

  const firstNames = [
    '太郎',
    '花子',
    '一郎',
    '美咲',
    '健太',
    'さくら',
    '誠',
    '由美',
    '大輔',
    '綾',
    '翔太',
    '麻衣',
    '隆',
    '恵美',
    '和也',
    '真理',
    '浩二',
    '優子',
    '拓也',
    '香織',
  ]

  const employees: Employee[] = []

  for (let i = 0; i < count; i++) {
    const year = 2015 + Math.floor(Math.random() * 9)
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')

    employees.push({
      id: `emp-${i + 1}`,
      name: `${lastNames[i % lastNames.length]}${firstNames[i % firstNames.length]}`,
      department: departments[i % departments.length],
      score: Math.floor(Math.random() * 5) + 1,
      avatar: avatars[i % avatars.length],
      position: positions[Math.floor(Math.random() * positions.length)],
      joinDate: `${year}-${month}-${day}`,
    })
  }

  return employees
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // GETメソッドのみ許可
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // 本番環境ではDBから取得
    // 例: const employees = await db.employees.findMany()
    const employees = generateEmployees(1000)

    // レスポンスを返す
    res.status(200).json({
      success: true,
      data: employees,
      count: employees.length,
    })
  } catch (error) {
    console.error('Error fetching employees:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
