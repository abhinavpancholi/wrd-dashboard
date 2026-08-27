/**
 * WRD Dashboard — Number & Display Formatters
 */

/**
 * Format number with Indian-style commas (e.g. 6,67,196.84 or 87,225)
 */
export function formatIndian(num, decimals = null) {
  if (num == null || isNaN(num)) return '—'
  const val = Number(num)
  if (decimals !== null) {
    return val.toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })
  }
  // If number has decimals, keep up to 2 decimals
  if (Number.isInteger(val)) {
    return val.toLocaleString('en-IN')
  }
  return val.toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

/**
 * Format a large number in Indian Lakh notation (e.g. 891683 -> "8.92 Lakh")
 */
export function toLakh(num) {
  if (num == null || isNaN(num)) return '—'
  return `${(num / 100000).toFixed(2)} Lakh`
}

/**
 * Format percentage with one decimal (e.g. 76.6%)
 */
export function formatPct(num) {
  if (num == null || isNaN(num)) return '—'
  return `${Number(num).toFixed(1)}%`
}

/**
 * Shorten FY label: "2026-27" -> "2026-27"
 */
export function shortenFY(fy) {
  if (!fy) return ''
  return fy
}
