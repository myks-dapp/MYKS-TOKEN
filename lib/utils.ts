// lib/utils.ts

/**
 * Utility untuk menggabungkan className Tailwind.
 * Menghapus falsy value (false, null, undefined) dan menggabungkan string.
 * @param inputs - Array className yang bisa berupa string atau falsy.
 * @returns String gabungan className.
 */
export function cn(...inputs: (string | undefined | false | null)[]): string {
  return inputs.filter(Boolean).join(' ')
}

/**
 * Format angka ke format mata uang global.
 * Default menggunakan mata uang USD dan locale en-US.
 * @param amount - Jumlah yang ingin diformat.
 * @param currency - Kode mata uang (contoh: 'USD', 'IDR', 'EUR').
 * @param locale - Kode locale (contoh: 'en-US', 'id-ID').
 * @returns String dalam format mata uang.
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format tanggal ke format global.
 * Default: format lokal pendek, bisa disesuaikan lewat opsi.
 * @param date - Tanggal dalam bentuk Date object atau string.
 * @param locale - Locale format (default 'en-US').
 * @param options - Opsi pemformatan tanggal.
 * @returns String tanggal terformat.
 */
export function formatDate(
  date: Date | string,
  locale: string = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(
    locale,
    options || {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }
  )
}
