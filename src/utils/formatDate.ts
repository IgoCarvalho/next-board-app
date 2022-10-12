import format from 'date-fns/format'

export function formatDate(date: Date) {
  return format(new Date(date), 'dd MMMM yyyy')
}
