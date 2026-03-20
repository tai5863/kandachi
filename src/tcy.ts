import type { TcyOptions, KandachiOptions } from './types.js';
import { DEFAULT_TCY_OPTIONS } from './types.js';

/** HTMLエスケープ */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** TCYオプションを解決 */
export function resolveTcyOptions(tcy: KandachiOptions['tcy']): TcyOptions {
  if (tcy === true) return { ...DEFAULT_TCY_OPTIONS, enabled: true };
  if (tcy === false) return { ...DEFAULT_TCY_OPTIONS, enabled: false };
  return { ...DEFAULT_TCY_OPTIONS, ...tcy, enabled: tcy.enabled ?? true };
}

/** 縦中横でラップ */
export function wrapTcy(text: string, options: TcyOptions): string {
  const { tag, className } = options;
  return `<${escapeHtml(tag)} class="${escapeHtml(className)}">${escapeHtml(text)}</${escapeHtml(tag)}>`;
}
