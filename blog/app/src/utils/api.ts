// 型定義
export type Employee = {
  id: string
  name: string
  department: string
  score: number
  avatar: string
  position: string
  joinDate: string
}

type ApiResponse<T> = {
  success: boolean
  data?: T
  count?: number
  message?: string
}

/**
 * 従業員データを取得
 */
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

/**
 * 従業員の評価を更新（将来的な拡張用）
 */
export const updateEmployeeScore = async (
  employeeId: string,
  newScore: number
): Promise<Employee> => {
  try {
    const response = await fetch(`/api/employees/${employeeId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ score: newScore }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Employee> = await response.json()

    if (!result.success || !result.data) {
      throw new Error(result.message || 'Failed to update employee score')
    }

    return result.data
  } catch (error) {
    console.error('Error updating employee score:', error)
    throw error
  }
}
