import date from './date'

export default function isNotLimitDate(timestamp) {
  return date('Y/m/d',timestamp) == '2099/12/31'
}
