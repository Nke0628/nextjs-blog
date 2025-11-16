import { useState } from 'react'
import Container from '@/components/layout/Container'
import SubHeading from '@/components/layout/SubHeading'

// 型定義
type Employee = {
  id: string
  name: string
  department: string
  score: number
  avatar: string
  position: string
  joinDate: string
}

// テストデータ
const initialEmployees: Employee[] = [
  { id: '1', name: '山田太郎', department: '営業部', score: 5, avatar: '👨‍💼', position: '課長', joinDate: '2018-04-01' },
  { id: '2', name: '佐藤花子', department: '営業部', score: 4, avatar: '👩‍💼', position: '主任', joinDate: '2019-07-15' },
  { id: '3', name: '鈴木一郎', department: '開発部', score: 5, avatar: '👨‍💻', position: 'シニアエンジニア', joinDate: '2017-06-01' },
  { id: '4', name: '田中美咲', department: '開発部', score: 3, avatar: '👩‍💻', position: 'エンジニア', joinDate: '2021-04-01' },
  { id: '5', name: '高橋健太', department: '開発部', score: 4, avatar: '👨‍💻', position: 'エンジニア', joinDate: '2020-08-01' },
  { id: '6', name: '伊藤さくら', department: '人事部', score: 4, avatar: '👩', position: '人事担当', joinDate: '2019-10-01' },
  { id: '7', name: '渡辺誠', department: '人事部', score: 5, avatar: '👨', position: '人事部長', joinDate: '2015-04-01' },
  { id: '8', name: '中村由美', department: '営業部', score: 3, avatar: '👩‍💼', position: '営業', joinDate: '2022-04-01' },
  { id: '9', name: '小林大輔', department: '総務部', score: 4, avatar: '👨‍💼', position: '総務課長', joinDate: '2018-09-01' },
  { id: '10', name: '加藤綾', department: '総務部', score: 3, avatar: '👩', position: '総務', joinDate: '2021-07-01' },
  { id: '11', name: '吉田翔太', department: '開発部', score: 2, avatar: '👨‍💻', position: 'ジュニアエンジニア', joinDate: '2023-04-01' },
  { id: '12', name: '山口麻衣', department: '営業部', score: 5, avatar: '👩‍💼', position: '営業部長', joinDate: '2016-04-01' },
]

const departments = ['営業部', '開発部', '人事部', '総務部']
const scores = [5, 4, 3, 2, 1]

const EvaluationPage = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 部署と点数でフィルタリング
  const getEmployeesByDepartmentAndScore = (department: string, score: number) => {
    return employees.filter((emp) => emp.department === department && emp.score === score)
  }

  // モーダルを開く
  const openModal = (employee: Employee) => {
    setSelectedEmployee(employee)
    setIsModalOpen(true)
  }

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalOpen(false)
    setSelectedEmployee(null)
  }

  // 点数を更新
  const updateScore = (newScore: number) => {
    if (selectedEmployee) {
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedEmployee.id ? { ...emp, score: newScore } : emp
        )
      )
      setSelectedEmployee({ ...selectedEmployee, score: newScore })
      closeModal()
    }
  }

  return (
    <Container>
      <SubHeading text="評価グリッド" />

      {/* グリッドレイアウト */}
      <div className="overflow-x-auto">
        <div className="min-w-max">
          {/* ヘッダー行 */}
          <div className="flex border-b-2 border-gray-300 dark:border-gray-600">
            <div className="w-24 p-4 font-bold bg-gray-100 dark:bg-gray-800 border-r-2 border-gray-300 dark:border-gray-600">
              点数
            </div>
            {departments.map((dept) => (
              <div
                key={dept}
                className="w-48 p-4 font-bold text-center bg-gray-100 dark:bg-gray-800 border-r border-gray-300 dark:border-gray-600"
              >
                {dept}
              </div>
            ))}
          </div>

          {/* データ行 */}
          {scores.map((score) => (
            <div
              key={score}
              className="flex border-b border-gray-200 dark:border-gray-700"
            >
              {/* 点数列 */}
              <div className="w-24 p-4 font-bold text-center bg-gray-50 dark:bg-gray-900 border-r-2 border-gray-300 dark:border-gray-600 flex items-center justify-center">
                {score}点
              </div>

              {/* 各部署のセル */}
              {departments.map((dept) => {
                const emps = getEmployeesByDepartmentAndScore(dept, score)
                return (
                  <div
                    key={`${dept}-${score}`}
                    className="w-48 p-3 border-r border-gray-200 dark:border-gray-700 min-h-[80px] bg-white dark:bg-gray-800"
                  >
                    <div className="flex flex-wrap gap-2">
                      {emps.map((emp) => (
                        <button
                          key={emp.id}
                          onClick={() => openModal(emp)}
                          className="text-4xl hover:scale-110 transition-transform cursor-pointer"
                          title={emp.name}
                        >
                          {emp.avatar}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 詳細モーダル */}
      {isModalOpen && selectedEmployee && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold dark:text-white">従業員詳細</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{selectedEmployee.avatar}</div>
                <div>
                  <h3 className="text-xl font-bold dark:text-white">{selectedEmployee.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{selectedEmployee.position}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <table className="w-full">
                  <tbody>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 font-semibold dark:text-gray-300">部署</td>
                      <td className="py-2 dark:text-white">{selectedEmployee.department}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 font-semibold dark:text-gray-300">入社日</td>
                      <td className="py-2 dark:text-white">{selectedEmployee.joinDate}</td>
                    </tr>
                    <tr className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-2 font-semibold dark:text-gray-300">現在の評価</td>
                      <td className="py-2 dark:text-white">{selectedEmployee.score}点</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <label className="block text-sm font-semibold mb-2 dark:text-gray-300">
                  評価を更新
                </label>
                <div className="flex gap-2">
                  {scores.map((score) => (
                    <button
                      key={score}
                      onClick={() => updateScore(score)}
                      className={`flex-1 py-2 px-4 rounded-lg font-bold transition-colors ${
                        selectedEmployee.score === score
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {score}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  )
}

export default EvaluationPage
