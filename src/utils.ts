/** 基本漢数字テーブル */
export const KANJI_DIGITS = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'] as const;

/** 大字（正式）テーブル */
export const FORMAL_DIGITS = ['零', '壱', '弐', '参', '肆', '伍', '陸', '漆', '捌', '玖'] as const;

/** 位（十、百、千） */
export const SMALL_UNITS = ['', '十', '百', '千'] as const;

/** 大字の位 */
export const FORMAL_SMALL_UNITS = ['', '拾', '佰', '仟'] as const;

/** 万以上の位 */
export const LARGE_UNITS = ['', '万', '億', '兆', '京', '垓'] as const;

/** 大字の万以上の位 */
export const FORMAL_LARGE_UNITS = ['', '萬', '億', '兆', '京', '垓'] as const;

/** 数字検出用の正規表現（カンマ区切り対応） */
export const NUMBER_PATTERN = /(\d{1,3}(,\d{3})+|\d+)(\.\d+)?/g;

/** 数字検出用の正規表現（カンマ非対応） */
export const NUMBER_PATTERN_NO_COMMA = /\d+(\.\d+)?/g;

/** カンマを除去して数値に変換 */
export function parseNumber(raw: string): { integer: string; decimal: string } {
  const [intPart, ...decParts] = raw.replace(/,/g, '').split('.');
  return {
    integer: intPart,
    decimal: decParts.length > 0 ? decParts.join('.') : '',
  };
}

/** 各桁を漢数字に変換（共通ヘルパー） */
export function digitToKanji(d: number): string {
  return KANJI_DIGITS[d];
}

/** 各桁を大字に変換 */
export function digitToFormal(d: number): string {
  return FORMAL_DIGITS[d];
}

/** 小数部を漢数字に変換（桁ごと置換） */
export function convertDecimal(decimal: string, digitFn: (d: number) => string): string {
  if (!decimal) return '';
  return '・' + [...decimal].map((c) => digitFn(Number(c))).join('');
}
