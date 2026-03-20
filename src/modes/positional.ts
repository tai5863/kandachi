import { KANJI_DIGITS, convertDecimal, digitToKanji } from '../utils.js';

/**
 * positional: 位取り記数法風（ゼロは〇）
 * 2026 → 二〇二六
 * simpleと同一だが意図を明示するために分離
 */
export function toPositional(integer: string, decimal?: string): string {
  const main = [...integer].map((c) => KANJI_DIGITS[Number(c)]).join('');
  return main + convertDecimal(decimal ?? '', digitToKanji);
}
