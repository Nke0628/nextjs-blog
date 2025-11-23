# 1000人規模の評価グリッドUIをNext.jsで実装した話

## はじめに

人事評価システムのような大規模データを扱うUIを実装する機会があり、1000人の従業員データを部署×評価点数のマトリクス形式で表示する評価グリッドを作成しました。この記事では、パフォーマンスを意識しながらどのように実装したかを共有します。

## 完成イメージ

![評価グリッド](https://via.placeholder.com/800x600?text=Evaluation+Grid)

- **行**: 評価点数（5点〜1点）
- **列**: 部署（20部署）
- **セル**: 該当する従業員の顔アイコン（クリックで詳細表示）
- **機能**: 検索・フィルタ、統計ダッシュボード、リアルタイム評価更新

## 技術スタック

```json
{
  "framework": "Next.js 13",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "optimization": "React.memo, useMemo, useCallback"
}
```

## 課題：大規模データのパフォーマンス

### 初期の問題

- 1000人のデータをレンダリング
- 20部署 × 5点数 = 100セル
- 検索・フィルタのたびに全データを再計算
- 無駄な再レンダリングでUIがカクカク

### 解決策

1. **React.memo** でコンポーネントのメモ化
2. **useMemo** で重い計算結果のキャッシュ
3. **useCallback** で関数の再生成を防止
4. **効率的なフィルタリング**

## 実装の詳細

### 1. データ構造

```typescript
type Employee = {
  id: string
  name: string
  department: string      // どの列に属するか
  score: number          // どの行に属するか
  avatar: string
  position: string
  joinDate: string
}
```

### 2. グリッドのマッピング仕組み

グリッドは**二重ループ**で構築します。

```typescript
// 外側のループ：点数ごとに行を作る
{scores.map((score) => (
  <div key={score} className="flex">

    {/* 内側のループ：部署ごとに列を作る */}
    {departments.map((dept) => {

      // この部署×この点数に該当する従業員を取得
      const emps = getEmployeesByDepartmentAndScore(dept, score)

      return <GridCell employees={emps} onEmployeeClick={openModal} />
    })}

  </div>
))}
```

**フィルタリング関数:**

```typescript
const getEmployeesByDepartmentAndScore = useCallback(
  (department: string, score: number) => {
    return filteredEmployees.filter(
      (emp) => emp.department === department && emp.score === score
    )
  },
  [filteredEmployees]
)
```

### 3. パフォーマンス最適化

#### (1) GridCellのメモ化

```typescript
const GridCell = memo(({
  employees,
  onEmployeeClick,
}: {
  employees: Employee[]
  onEmployeeClick: (emp: Employee) => void
}) => {
  return (
    <div className="w-56 p-3 min-h-[100px] flex-shrink-0">
      <div className="flex flex-wrap gap-2 w-full">
        {employees.map((emp) => (
          <button
            key={emp.id}
            onClick={() => onEmployeeClick(emp)}
            className="text-3xl hover:scale-125 transition-transform"
            title={emp.name}
          >
            {emp.avatar}
          </button>
        ))}
      </div>
    </div>
  )
})

GridCell.displayName = 'GridCell'
```

**ポイント:**
- `React.memo` でpropsが変わらない限り再レンダリングしない
- `flex-shrink-0` で横幅を固定、縦に伸びるようにする

#### (2) useMemoで計算結果をキャッシュ

```typescript
// 部署リスト（employeesが変わったときだけ再計算）
const departments = useMemo(() => {
  const deptSet = new Set(employees.map((emp) => emp.department))
  return Array.from(deptSet).sort()
}, [employees])

// フィルタリング済み従業員
const filteredEmployees = useMemo(() => {
  return employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment =
      selectedDepartment === 'all' || emp.department === selectedDepartment
    const matchesScore =
      selectedScore === 'all' || emp.score === selectedScore

    return matchesSearch && matchesDepartment && matchesScore
  })
}, [employees, searchTerm, selectedDepartment, selectedScore])

// 統計情報
const statistics = useMemo(() => {
  const total = filteredEmployees.length
  const avgScore = total > 0
    ? (filteredEmployees.reduce((sum, emp) => sum + emp.score, 0) / total).toFixed(2)
    : '0'

  const scoreDistribution = scores.map((score) => ({
    score,
    count: filteredEmployees.filter((emp) => emp.score === score).length,
    percentage: total > 0
      ? ((filteredEmployees.filter((emp) => emp.score === score).length / total) * 100).toFixed(1)
      : '0',
  }))

  return { total, avgScore, scoreDistribution }
}, [filteredEmployees, scores])
```

**効果:**
- `searchTerm`が変わっても、`departments`は再計算されない
- フィルタ条件が変わらなければ、`filteredEmployees`も再利用される

#### (3) useCallbackで関数をメモ化

```typescript
// モーダル操作
const openModal = useCallback((employee: Employee) => {
  setSelectedEmployee(employee)
  setIsModalOpen(true)
}, [])

const closeModal = useCallback(() => {
  setIsModalOpen(false)
  setSelectedEmployee(null)
}, [])

const updateScore = useCallback(
  (newScore: number) => {
    if (selectedEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedEmployee.id ? { ...emp, score: newScore } : emp
        )
      )
      setSelectedEmployee({ ...selectedEmployee, score: newScore })
      closeModal()
    }
  },
  [selectedEmployee, closeModal]
)
```

**効果:**
- 関数が毎回新しく作られない
- `GridCell`に渡す`onEmployeeClick`が変わらない
- React.memoと組み合わせて不要な再レンダリングを防ぐ

### 4. API統合

#### Next.js APIルート

```typescript
// pages/api/employees.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    // 本番環境ではDBから取得
    const employees = await db.employees.findMany()

    res.status(200).json({
      success: true,
      data: employees,
      count: employees.length,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
```

#### API呼び出し関数

```typescript
// utils/api.ts
export const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await fetch('/api/employees')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Employee[]> = await response.json()

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to fetch employees')
    }

    return result.data
  } catch (error) {
    console.error('Error fetching employees:', error)
    throw error
  }
}
```

#### コンポーネント側での使用

```typescript
const EvaluationPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchEmployees()
        setEmployees(data)
      } catch (err) {
        setError('従業員データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    loadEmployees()
  }, [])

  // ローディング中
  if (isLoading) {
    return <LoadingSpinner />
  }

  // エラー発生時
  if (error) {
    return <ErrorMessage error={error} />
  }

  // 通常表示
  return <EvaluationGrid employees={employees} />
}
```

### 5. ハイドレーションエラーの回避

サーバーとクライアントでランダムデータが異なるとエラーになるため、データ生成はクライアント側のみで行います。

```typescript
// ❌ これはハイドレーションエラーになる
const [employees, setEmployees] = useState(() => generateEmployees(1000))

// ✅ useEffectでクライアント側のみで生成
const [employees, setEmployees] = useState<Employee[]>([])

useEffect(() => {
  setEmployees(generateEmployees(1000))
}, [])
```

**理由:**
1. サーバー側: ランダムデータA を生成 → HTML出力
2. クライアント側: ランダムデータB を生成 → HTML生成
3. A ≠ B なのでエラー

**解決策:**
1. サーバー側: 空配列 `[]` でレンダリング
2. クライアント側: 最初は空配列 `[]` でレンダリング（一致！）
3. マウント後: `useEffect`でデータ生成 → 再レンダリング

## パフォーマンス比較

### 最適化なし

```
検索ボックスに1文字入力
  ↓
100セル全部が再レンダリング
  ↓
重い計算を何度も実行
  ↓
カクカク 😢
```

### 最適化あり

```
検索ボックスに1文字入力
  ↓
filteredEmployeesが変わる
  ↓
変更のあるセルだけ再レンダリング（例：10セル）
  ↓
計算結果はキャッシュを再利用
  ↓
ヌルヌル！ 😊
```

## UIの工夫

### 1. 統計ダッシュボード

```typescript
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
    <div className="text-sm opacity-90">総従業員数</div>
    <div className="text-4xl font-bold mt-2">{statistics.total}</div>
  </div>
  <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
    <div className="text-sm opacity-90">平均評価</div>
    <div className="text-4xl font-bold mt-2">{statistics.avgScore}</div>
  </div>
  <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
    <div className="text-sm opacity-90">部署数</div>
    <div className="text-4xl font-bold mt-2">{departments.length}</div>
  </div>
</div>
```

### 2. 評価分布の可視化

```typescript
<div className="grid grid-cols-5 gap-4">
  {statistics.scoreDistribution.map(({ score, count, percentage }) => (
    <div key={score} className="text-center">
      <div className="text-3xl font-bold">{score}</div>
      <div className="text-sm text-gray-500">
        {count}名 ({percentage}%)
      </div>
      <div className="mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  ))}
</div>
```

### 3. 検索・フィルタ

```typescript
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <input
    type="text"
    placeholder="名前・部署・役職で検索..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
  />

  <select
    value={selectedDepartment}
    onChange={(e) => setSelectedDepartment(e.target.value)}
    className="px-4 py-3 border rounded-lg"
  >
    <option value="all">すべての部署</option>
    {departments.map((dept) => (
      <option key={dept} value={dept}>{dept}</option>
    ))}
  </select>

  <select
    value={selectedScore}
    onChange={(e) => setSelectedScore(e.target.value === 'all' ? 'all' : Number(e.target.value))}
    className="px-4 py-3 border rounded-lg"
  >
    <option value="all">すべての評価</option>
    {scores.map((score) => (
      <option key={score} value={score}>{score}点</option>
    ))}
  </select>

  <button onClick={resetFilters} className="px-4 py-3 bg-gray-200 rounded-lg">
    フィルタをリセット
  </button>
</div>
```

### 4. モーダルでの詳細表示

```typescript
{isModalOpen && selectedEmployee && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
      <h2 className="text-2xl font-bold mb-6">従業員詳細</h2>

      <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
        <div className="text-7xl">{selectedEmployee.avatar}</div>
        <div>
          <h3 className="text-2xl font-bold">{selectedEmployee.name}</h3>
          <p className="text-gray-600 mt-1">{selectedEmployee.position}</p>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-bold mb-3">評価を更新</label>
        <div className="flex gap-2">
          {scores.map((score) => (
            <button
              key={score}
              onClick={() => updateScore(score)}
              className={`flex-1 py-3 rounded-lg font-bold ${
                selectedEmployee.score === score
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {score}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
)}
```

## 学んだこと

### 1. useMemoとuseCallbackの使い分け

| フック | 用途 | キャッシュするもの |
|--------|------|-------------------|
| useMemo | 計算結果の再利用 | 値（配列、オブジェクト、数値） |
| useCallback | 関数の再利用 | 関数そのもの |

```typescript
// 値をキャッシュ → useMemo
const result = useMemo(() => heavyCalculation(), [deps])

// 関数をキャッシュ → useCallback
const handleClick = useCallback(() => doSomething(), [deps])
```

### 2. React.memoとの組み合わせ

```typescript
// 1. コンポーネントをメモ化
const GridCell = memo(({ employees, onEmployeeClick }) => {
  return <div>...</div>
})

// 2. 関数をuseCallbackでメモ化
const openModal = useCallback((employee) => {
  // ...
}, [])

// 3. propsが変わらなければ再レンダリングされない
<GridCell employees={emps} onEmployeeClick={openModal} />
```

### 3. パラメータの有無で判断

```typescript
// パラメータあり → useCallback（遅延評価）
const getFiltered = useCallback((searchTerm: string) => {
  return data.filter(item => item.name.includes(searchTerm))
}, [data])

// パラメータなし → useMemo（即座に計算）
const filteredData = useMemo(() => {
  return data.filter(item => item.active)
}, [data])
```

### 4. 過剰な最適化に注意

```typescript
// ❌ 過剰な最適化（単純な計算ならそのままでOK）
const fullName = useMemo(() => {
  return firstName + ' ' + lastName
}, [firstName, lastName])

// ✅ 普通に計算
const fullName = firstName + ' ' + lastName
```

## まとめ

1000人規模のデータを扱う評価グリッドUIを実装し、以下の知見を得ました：

1. **React.memo + useMemo + useCallback** の組み合わせで大幅なパフォーマンス改善
2. **二重ループ**でグリッドを効率的にマッピング
3. **API統合**で実際のプロダクトに近い形で実装
4. **ローディング・エラーハンドリング**でUX向上
5. **flex-shrink-0**で横幅固定、縦に伸びるグリッド実現

大規模データを扱うUIでは、最適化が必須です。ただし、過剰な最適化は避け、**測定してから最適化する**ことが重要だと学びました。

## コード全体

GitHubリポジトリ: [nextjs-blog](https://github.com/Nke0628/nextjs-blog)

ブランチ: `claude/evaluation-ui-component-017VJdPGvqs7yynP7gFUMZpc`

## 参考資料

- [React.memo](https://react.dev/reference/react/memo)
- [useMemo](https://react.dev/reference/react/useMemo)
- [useCallback](https://react.dev/reference/react/useCallback)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Tailwind CSS](https://tailwindcss.com/)

---

この記事が大規模データを扱うUI開発の参考になれば幸いです！
