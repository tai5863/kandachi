import { SMALL_UNITS, LARGE_UNITS, convertDecimal, digitToKanji } from '../utils.js';

/**
 * standard: 位取り漢数字
 * 12500 → 一万二千五百
 * 兆（10^12）まで対応
 */
export function toStandard(integer: string, decimal?: string): string {
  const n = BigInt(integer);
  if (n === 0n) return '〇' + convertDecimal(decimal ?? '', digitToKanji);

  const main = convertLargeNumber(n);
  return main + convertDecimal(decimal ?? '', digitToKanji);
}

function convertLargeNumber(n: bigint): string {
  if (n === 0n) return '';

  const groups: bigint[] = [];
  let remaining = n;

  // 4桁ごとに分割（万、億、兆）
  while (remaining > 0n) {
    groups.push(remaining % 10000n);
    remaining = remaining / 10000n;
  }

  // ガード: LARGE_UNITSの範囲を超えたらsimple変換にフォールバック
  if (groups.length > LARGE_UNITS.length) {
    return [...String(n)].map((c) => digitToKanji(Number(c))).join('');
  }

  let result = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i];
    if (group === 0n) continue;

    const groupStr = convertGroup(Number(group));
    result += groupStr + LARGE_UNITS[i];
  }

  return result;
}

/** 4桁以下のグループを変換 */
function convertGroup(n: number): string {
  if (n === 0) return '';

  let result = '';
  const digits = [
    Math.floor(n / 1000),
    Math.floor((n % 1000) / 100),
    Math.floor((n % 100) / 10),
    n % 10,
  ];

  for (let i = 0; i < 4; i++) {
    const d = digits[i];
    if (d === 0) continue;

    const unitIndex = 3 - i;
    // 十、百、千の前の「一」は省略
    if (d === 1 && unitIndex > 0) {
      result += SMALL_UNITS[unitIndex];
    } else {
      result += digitToKanji(d) + SMALL_UNITS[unitIndex];
    }
  }

  return result;
}
