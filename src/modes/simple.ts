import { KANJI_DIGITS, convertDecimal, digitToKanji } from '../utils.js';

/**
 * simple: 各桁を単純置換
 * 1234 → 一二三四
 */
export function toSimple(integer: string, decimal?: string): string {
  const main = [...integer].map((c) => KANJI_DIGITS[Number(c)]).join('');
  return main + convertDecimal(decimal ?? '', digitToKanji);
}
