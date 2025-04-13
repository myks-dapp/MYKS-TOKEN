// lib/utils.ts

/**
 * Utility untuk menggabungkan className Tailwind.
 */
export function cn(...inputs: (string | undefined | false | null)[]): string {
  return inputs.filter(Boolean).join(' ')
}

/**
 * Format angka ke format mata uang global (USD default).
 */
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format tanggal ke format global (ISO atau lokal sesuai preferensi).
 */
export function formatDate(date: Date | string, locale: string = 'en-US', options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, options || {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
