export type { ConversionMode, TcyOptions, KandachiOptions } from './types.js';
export { DEFAULT_OPTIONS, DEFAULT_TCY_OPTIONS } from './types.js';

export { toSimple } from './modes/simple.js';
export { toPositional } from './modes/positional.js';
export { toStandard } from './modes/standard.js';
export { toFormal } from './modes/formal.js';

export { convertText } from './converter.js';
export { formatHTML, applyToElement } from './html-processor.js';
export { wrapTcy } from './tcy.js';

import type { KandachiOptions } from './types.js';
import { DEFAULT_OPTIONS } from './types.js';
import { convertText, toKanji } from './converter.js';
import type { ConversionMode } from './types.js';

/** テキスト内の数字を漢数字に変換 */
export function format(text: string, options?: Partial<KandachiOptions>): string {
  const opts: KandachiOptions = { ...DEFAULT_OPTIONS, ...options };
  return convertText(text, opts);
}

/** 設定再利用向けのクラスAPI */
export class Kandachi {
  private options: KandachiOptions;

  constructor(options?: Partial<KandachiOptions>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  format(text: string): string {
    return convertText(text, this.options);
  }

  toKanji(num: number, mode?: ConversionMode): string {
    return toKanji(num, mode ?? this.options.mode);
  }
}

export { toKanji };
