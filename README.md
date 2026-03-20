# kandachi (漢立ち)

Vertical Japanese numeral formatting — 縦書き日本語数字フォーマッティング

Arabic numerals to Kanji numerals, with TCY (tate-chu-yoko) and HTML support.

## Install

```bash
npm install kandachi
```

## Usage

```js
import { format, toKanji, Kandachi } from 'kandachi';

// テキスト内の数字を漢数字に変換
format('12500円');                          // → '一万二千五百円'
format('2026年3月20日', { mode: 'positional' }); // → '二〇二六年三月二〇日'

// 数値を直接変換
toKanji(12500);              // → '一万二千五百'
toKanji(12500, 'formal');    // → '壱萬弐仟伍佰'

// クラスAPIで設定を再利用
const k = new Kandachi({ mode: 'positional' });
k.format('2026年');  // → '二〇二六年'
k.toKanji(42);       // → '四二'
```

## Conversion Modes

| Mode | Example | Description |
|------|---------|-------------|
| `standard` | `12500` → `一万二千五百` | 位取り漢数字 (default) |
| `positional` | `2026` → `二〇二六` | 桁並び — 年号・電話番号向け |
| `formal` | `12500` → `壱萬弐仟伍佰` | 大字 — 契約書・領収書向け |
| `simple` | `1234` → `一二三四` | 各桁を単純置換 |

## TCY (Tate-Chu-Yoko / 縦中横)

2桁以下の数字を `<span class="tcy">` でラップし、CSS `text-combine-upright: all` と組み合わせて縦書き内で横組み表示する。

```js
format('12月25日', { tcy: true });
// → '<span class="tcy">12</span>月<span class="tcy">25</span>日'
```

```css
.tcy { text-combine-upright: all; }
```

Options:

```js
format('12月25日', {
  tcy: {
    enabled: true,
    maxDigits: 2,    // TCY適用の最大桁数 (default: 2)
    className: 'tcy', // CSSクラス名 (default: 'tcy')
    tag: 'span',      // HTMLタグ (default: 'span')
  }
});
```

## HTML Processing

HTMLタグを壊さずにテキストノード内の数字だけを変換する。

```js
import { formatHTML, applyToElement } from 'kandachi';

// 文字列ベース (DOM不要、SSR向け)
formatHTML('<p>2026年</p>', { mode: 'positional' });
// → '<p>二〇二六年</p>'

// DOMベース (ブラウザ向け)
applyToElement(document.querySelector('.vertical'), { mode: 'standard' });
```

## Web Component

```html
<script type="module">
  import 'kandachi/webcomponent';
</script>

<kandachi-ja>12500円</kandachi-ja>
<!-- → 一万二千五百円 -->

<kandachi-ja mode="positional">2026年3月20日</kandachi-ja>
<!-- → 二〇二六年三月二〇日 -->

<kandachi-ja mode="formal">12500円</kandachi-ja>
<!-- → 壱萬弐仟伍佰円 -->

<kandachi-ja tcy>12月25日</kandachi-ja>
<!-- → <span class="tcy">12</span>月<span class="tcy">25</span>日 -->
```

| Attribute | Description |
|-----------|-------------|
| `mode` | `standard` \| `positional` \| `formal` \| `simple` |
| `tcy` | 縦中横を有効化 |
| `tcy-max` | TCY最大桁数 (default: `2`) |
| `tcy-class` | TCYクラス名 (default: `tcy`) |

## CLI

```bash
npx kandachi "12500円"
# → 一万二千五百円

echo "2026年3月20日" | npx kandachi -m positional
# → 二〇二六年三月二〇日

npx kandachi -m formal "12500円"
# → 壱萬弐仟伍佰円

npx kandachi -t "12月25日"
# → <span class="tcy">12</span>月<span class="tcy">25</span>日
```

## API

### `format(text, options?)`

テキスト内の数字を漢数字に変換する。

### `toKanji(num, mode?)`

数値を漢数字文字列に変換する。

### `formatHTML(html, options?)`

HTMLタグを保持しつつテキストノード内の数字を変換する。DOM不要。

### `applyToElement(element, options?)`

DOM要素内のテキストノードを直接変換する。ブラウザ専用。

### `wrapTcy(text, options)`

文字列をTCYタグでラップする。

### `new Kandachi(options?)`

設定を再利用するためのクラスAPI。`format()` と `toKanji()` メソッドを持つ。

### Options

```ts
interface KandachiOptions {
  mode: 'standard' | 'positional' | 'formal' | 'simple';
  tcy: boolean | Partial<TcyOptions>;
  handleComma: boolean;   // カンマ区切り対応 (default: true)
  handleDecimal: boolean; // 小数点対応 (default: true)
}
```

## Supported Range

- 整数: `0` から `10^23` (垓) まで
- 小数: 対応 (`3.14` → `三・一四`)
- カンマ区切り: 対応 (`1,000,000` → `百万`)

## Bundle Size

| Entry | Size (minified + brotli) |
|-------|--------------------------|
| `kandachi` | ~1.2 KB |
| `kandachi/webcomponent` | ~1.3 KB |

## License

[MIT](LICENSE)
