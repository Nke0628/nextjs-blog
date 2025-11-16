import { useState, useMemo, useCallback, memo, useEffect } from 'react'
import Container from '@/components/layout/Container'
import SubHeading from '@/components/layout/SubHeading'
import { fetchEmployees, type Employee } from '@/utils/api'

// 大規模テストデータ生成（削除予定 - APIから取得）
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

// メモ化されたグリッドセルコンポーネント
const GridCell = memo(
  ({
    employees,
    onEmployeeClick,
  }: {
    employees: Employee[]
    onEmployeeClick: (emp: Employee) => void
  }) => {
    return (
      <div className="w-56 p-3 min-h-[100px] bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors flex-shrink-0">
        <div className="flex flex-wrap gap-2 w-full">
          {employees.map((emp) => (
            <button
              key={emp.id}
              onClick={() => onEmployeeClick(emp)}
              className="text-3xl hover:scale-125 transition-transform cursor-pointer filter hover:drop-shadow-lg"
              title={emp.name}
            >
              {emp.avatar}
            </button>
          ))}
        </div>
        {employees.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {employees.length}名
          </div>
        )}
      </div>
    )
  }
)

GridCell.displayName = 'GridCell'

const EvaluationPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all')
  const [selectedScore, setSelectedScore] = useState<number | 'all'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const scores = [5, 4, 3, 2, 1]

  // APIから従業員データを取得
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchEmployees()
        setEmployees(data)
      } catch (err) {
        console.error('Failed to fetch employees:', err)
        setError('従業員データの取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    loadEmployees()
  }, [])

  // 部署リストを取得
  const departments = useMemo(() => {
    const deptSet = new Set(employees.map((emp) => emp.department))
    return Array.from(deptSet).sort()
  }, [employees])

  // フィルタリングされた従業員
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.position.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesDepartment =
        selectedDepartment === 'all' || emp.department === selectedDepartment
      const matchesScore = selectedScore === 'all' || emp.score === selectedScore

      return matchesSearch && matchesDepartment && matchesScore
    })
  }, [employees, searchTerm, selectedDepartment, selectedScore])

  // 統計情報
  const statistics = useMemo(() => {
    const total = filteredEmployees.length
    const avgScore =
      total > 0
        ? (
            filteredEmployees.reduce((sum, emp) => sum + emp.score, 0) / total
          ).toFixed(2)
        : '0'

    const scoreDistribution = scores.map((score) => ({
      score,
      count: filteredEmployees.filter((emp) => emp.score === score).length,
      percentage:
        total > 0
          ? ((filteredEmployees.filter((emp) => emp.score === score).length / total) * 100).toFixed(
              1
            )
          : '0',
    }))

    return { total, avgScore, scoreDistribution }
  }, [filteredEmployees, scores])

  // 部署と点数でフィルタリング
  const getEmployeesByDepartmentAndScore = useCallback(
    (department: string, score: number) => {
      return filteredEmployees.filter(
        (emp) => emp.department === department && emp.score === score
      )
    },
    [filteredEmployees]
  )

  // モーダルを開く
  const openModal = useCallback((employee: Employee) => {
    setSelectedEmployee(employee)
    setIsModalOpen(true)
  }, [])

  // モーダルを閉じる
  const closeModal = useCallback(() => {
    setIsModalOpen(false)
    setSelectedEmployee(null)
  }, [])

  // 点数を更新
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

  // フィルタをリセット
  const resetFilters = useCallback(() => {
    setSearchTerm('')
    setSelectedDepartment('all')
    setSelectedScore('all')
  }, [])

  // ローディング中
  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              従業員データを読み込んでいます...
            </p>
          </div>
        </div>
      </Container>
    )
  }

  // エラー発生時
  if (error) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              エラーが発生しました
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              再読み込み
            </button>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="space-y-6">
        <SubHeading text="評価グリッド" />

        {/* 統計ダッシュボード */}
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

        {/* 評価分布 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-bold mb-4 dark:text-white">評価分布</h3>
          <div className="grid grid-cols-5 gap-4">
            {statistics.scoreDistribution.map(({ score, count, percentage }) => (
              <div key={score} className="text-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-white">{score}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {count}名 ({percentage}%)
                </div>
                <div className="mt-2 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 検索・フィルタ */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="名前・部署・役職で検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            />

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            >
              <option value="all">すべての部署</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={selectedScore}
              onChange={(e) =>
                setSelectedScore(e.target.value === 'all' ? 'all' : Number(e.target.value))
              }
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
            >
              <option value="all">すべての評価</option>
              {scores.map((score) => (
                <option key={score} value={score}>
                  {score}点
                </option>
              ))}
            </select>

            <button
              onClick={resetFilters}
              className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              フィルタをリセット
            </button>
          </div>
        </div>

        {/* グリッドレイアウト */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* ヘッダー行 */}
              <div className="flex sticky top-0 z-10 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-b-2 border-gray-300 dark:border-gray-600">
                <div className="w-32 p-4 font-bold sticky left-0 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 border-r-2 border-gray-300 dark:border-gray-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg dark:text-white">評価</span>
                </div>
                {departments.map((dept) => (
                  <div
                    key={dept}
                    className="w-56 p-4 font-bold text-center border-r border-gray-300 dark:border-gray-600 flex-shrink-0"
                  >
                    <div className="dark:text-white text-sm">{dept}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {filteredEmployees.filter((emp) => emp.department === dept).length}名
                    </div>
                  </div>
                ))}
              </div>

              {/* データ行 */}
              {scores.map((score) => (
                <div key={score} className="flex">
                  {/* 点数列 */}
                  <div className="w-32 p-4 font-bold text-center bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-r-2 border-b border-gray-300 dark:border-gray-600 flex items-center justify-center sticky left-0 z-10 flex-shrink-0">
                    <div>
                      <div className="text-3xl dark:text-white">{score}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">点</div>
                    </div>
                  </div>

                  {/* 各部署のセル */}
                  {departments.map((dept) => {
                    const emps = getEmployeesByDepartmentAndScore(dept, score)
                    return (
                      <GridCell
                        key={`${dept}-${score}`}
                        employees={emps}
                        onEmployeeClick={openModal}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 詳細モーダル */}
      {isModalOpen && selectedEmployee && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                従業員詳細
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-6 p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-750 rounded-xl">
                <div className="text-7xl">{selectedEmployee.avatar}</div>
                <div>
                  <h3 className="text-2xl font-bold dark:text-white">
                    {selectedEmployee.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    {selectedEmployee.position}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">部署</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {selectedEmployee.department}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-750 rounded-lg">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">入社日</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {selectedEmployee.joinDate}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    現在の評価
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {selectedEmployee.score}点
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
                  評価を更新
                </label>
                <div className="flex gap-2">
                  {scores.map((score) => (
                    <button
                      key={score}
                      onClick={() => updateScore(score)}
                      className={`flex-1 py-3 px-4 rounded-lg font-bold transition-all transform hover:scale-105 ${
                        selectedEmployee.score === score
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={closeModal}
                className="w-full py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </Container>
  )
}

export default EvaluationPage
