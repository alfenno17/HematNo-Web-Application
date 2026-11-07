// utils/format.js

export function formatRupiah(amount, compact = false) {
  const abs = Math.abs(amount)
  const prefix = amount < 0 ? '-' : ''
  if (compact && abs >= 1_000_000) {
    return prefix + 'Rp' + (abs / 1_000_000).toFixed(1).replace('.0', '') + 'jt'
  }
  if (compact && abs >= 1_000) {
    return prefix + 'Rp' + (abs / 1_000).toFixed(0) + 'rb'
  }
  return (
    prefix +
    'Rp' +
    Math.round(abs)
      .toLocaleString('id-ID')
  )
}

export function formatDate(isoString) {
  const d = new Date(isoString)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

export function formatTime(isoString) {
  const d = new Date(isoString)
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
}

export function startOfDay(date = new Date()) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function startOfWeek(date = new Date()) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function startOfMonth(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfDay(date = new Date()) {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}
