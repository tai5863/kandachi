import type { ConversionMode, KandachiOptions } from './types.js';
import { DEFAULT_OPTIONS, DEFAULT_TCY_OPTIONS } from './types.js';
import { NUMBER_PATTERN, NUMBER_PATTERN_NO_COMMA, parseNumber } from './utils.js';
import { toSimple } from './modes/simple.js';
import { toPositional } from './modes/positional.js';
import { toStandard } from './modes/standard.js';
import { toFormal } from './modes/formal.js';
import { wrapTcy, resolveTcyOptions } from './tcy.js';

const MODE_MAP: Record<ConversionMode, (integer: string, decimal?: string) => string> = {
  simple: toSimple,
  positional: toPositional,
  standard: toStandard,
  formal: toFormal,
};

/** 数値を漢数字に変換 */
export function toKanji(num: number, mode: ConversionMode = 'standard'): string {
  const str = String(num);
  const { integer, decimal } = parseNumber(str);
  return MODE_MAP[mode](integer, decimal);
}

/** テキスト内の数字を検出して変換 */
export function convertText(text: string, options: KandachiOptions = DEFAULT_OPTIONS): string {
  const tcyOpts = resolveTcyOptions(options.tcy);
  const modeFn = MODE_MAP[options.mode];

  const pattern = options.handleComma ? NUMBER_PATTERN : NUMBER_PATTERN_NO_COMMA;

  return text.replace(pattern, (match) => {
    const { integer, decimal } = parseNumber(match);

    // TCYが有効で桁数がmaxDigits以下ならTCYラップ
    if (tcyOpts.enabled && integer.length <= tcyOpts.maxDigits && !decimal) {
      return wrapTcy(match.replace(/,/g, ''), tcyOpts);
    }

    const result = modeFn(integer, options.handleDecimal ? decimal : undefined);
    return result;
  });
}
