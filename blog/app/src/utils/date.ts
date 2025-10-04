import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

/**
 * UTC文字列をJST（日本標準時）でフォーマットして返す
 * @param utcDate UTC形式の日時文字列
 * @param format フォーマット例: 'YYYY年MM月DD日 HH:mm'
 */
export function formatUTCtoJST(
  utcDate: string,
  format: string = 'YYYY年MM月DD日 HH:mm',
) {
  return dayjs(utcDate).format(format)
}
