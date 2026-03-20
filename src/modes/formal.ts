import {
  FORMAL_SMALL_UNITS,
  FORMAL_LARGE_UNITS,
  FORMAL_DIGITS,
  convertDecimal,
  digitToFormal,
} from '../utils.js';

/**
 * formal: 大字（正式表記）
 * 12500 → 壱萬弐仟伍佰
 */
export function toFormal(integer: string, decimal?: string): string {
  const n = BigInt(integer);
  if (n === 0n) return '零' + convertDecimal(decimal ?? '', digitToFormal);

  const main = convertLargeNumber(n);
  return main + convertDecimal(decimal ?? '', digitToFormal);
}

function convertLargeNumber(n: bigint): string {
  if (n === 0n) return '';

  const groups: bigint[] = [];
  let remaining = n;

  while (remaining > 0n) {
    groups.push(remaining % 10000n);
    remaining = remaining / 10000n;
  }

  // ガード: FORMAL_LARGE_UNITSの範囲を超えたらsimple変換にフォールバック
  if (groups.length > FORMAL_LARGE_UNITS.length) {
    return [...String(n)].map((c) => digitToFormal(Number(c))).join('');
  }

  let result = '';
  for (let i = groups.length - 1; i >= 0; i--) {
    const group = groups[i];
    if (group === 0n) continue;

    const groupStr = convertGroup(Number(group));
    result += groupStr + FORMAL_LARGE_UNITS[i];
  }

  return result;
}

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
    // 大字は「一」も省略しない
    result += digitToFormal(d) + FORMAL_SMALL_UNITS[unitIndex];
  }

  return result;
}
