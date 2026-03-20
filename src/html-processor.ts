import type { KandachiOptions } from './types.js';
import { DEFAULT_OPTIONS } from './types.js';
import { convertText } from './converter.js';

/**
 * HTML文字列内のテキストノードのみを変換（タグ内は無視）
 * 正規表現ベース — DOM不要
 */
export function formatHTML(html: string, options?: Partial<KandachiOptions>): string {
  const opts: KandachiOptions = { ...DEFAULT_OPTIONS, ...options };

  // HTMLタグとテキストを分離して、テキスト部分のみ変換
  // タグ（属性値含む）はそのまま保持
  return html.replace(/(>[^<]*<)|^([^<]*)|([^<]*)$/g, (match) => {
    if (match.startsWith('>') && match.endsWith('<')) {
      // >text< パターン: 前後のデリミタを保持してテキスト部分のみ変換
      const text = match.slice(1, -1);
      return '>' + convertText(text, opts) + '<';
    }
    // 先頭・末尾のタグ外テキスト
    return convertText(match, opts);
  });
}

/**
 * ブラウザ向け: DOM要素内のテキストノードを直接変換
 * TreeWalkerでテキストノードを走査
 */
export function applyToElement(
  element: Element,
  options?: Partial<KandachiOptions>,
): void {
  const opts: KandachiOptions = { ...DEFAULT_OPTIONS, ...options };
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

  const nodes: Text[] = [];
  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    nodes.push(node);
  }

  for (const textNode of nodes) {
    const original = textNode.textContent;
    if (!original) continue;

    const converted = convertText(original, opts);
    if (converted !== original) {
      // TCYなどでHTMLタグが含まれる場合はinnerHTMLで置換
      if (converted.includes('<')) {
        const wrapper = document.createElement('span');
        wrapper.innerHTML = converted;
        textNode.replaceWith(...wrapper.childNodes);
      } else {
        textNode.textContent = converted;
      }
    }
  }
}
