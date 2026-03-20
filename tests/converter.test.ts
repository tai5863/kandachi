import { describe, it, expect } from 'vitest';
import { convertText, toKanji } from '../src/converter.js';
import { DEFAULT_OPTIONS } from '../src/types.js';

describe('toKanji', () => {
  it('converts number to standard kanji', () => {
    expect(toKanji(12500)).toBe('一万二千五百');
  });

  it('converts with specified mode', () => {
    expect(toKanji(2026, 'positional')).toBe('二〇二六');
    expect(toKanji(1234, 'simple')).toBe('一二三四');
    expect(toKanji(12500, 'formal')).toBe('壱萬弐仟伍佰');
  });

  it('handles zero', () => {
    expect(toKanji(0)).toBe('〇');
  });

  it('handles decimals', () => {
    expect(toKanji(3.14)).toBe('三・一四');
  });
});

describe('convertText', () => {
  it('converts numbers in text', () => {
    expect(convertText('2026年3月20日', { ...DEFAULT_OPTIONS, mode: 'positional' }))
      .toBe('二〇二六年三月二〇日');
  });

  it('preserves non-number text', () => {
    expect(convertText('テスト', DEFAULT_OPTIONS)).toBe('テスト');
    expect(convertText('abc', DEFAULT_OPTIONS)).toBe('abc');
  });

  it('converts multiple numbers', () => {
    const result = convertText('12月25日', { ...DEFAULT_OPTIONS, mode: 'positional' });
    expect(result).toBe('一二月二五日');
  });

  it('handles comma-separated numbers', () => {
    const result = convertText('1,000,000円', DEFAULT_OPTIONS);
    expect(result).toBe('百万円');
  });

  it('handles decimal numbers', () => {
    const result = convertText('3.14は円周率', DEFAULT_OPTIONS);
    expect(result).toBe('三・一四は円周率');
  });

  it('standard mode converts real sentences', () => {
    expect(convertText('12500円', DEFAULT_OPTIONS)).toBe('一万二千五百円');
  });

  it('handles TCY option', () => {
    const result = convertText('12月25日', {
      ...DEFAULT_OPTIONS,
      tcy: { enabled: true, maxDigits: 2, className: 'tcy', tag: 'span' },
    });
    expect(result).toBe('<span class="tcy">12</span>月<span class="tcy">25</span>日');
  });

  it('TCY falls back to kanji for 3+ digits', () => {
    const result = convertText('123個', {
      ...DEFAULT_OPTIONS,
      tcy: { enabled: true, maxDigits: 2, className: 'tcy', tag: 'span' },
    });
    expect(result).toBe('百二十三個');
  });

  it('handleComma=false treats commas as non-numeric separators', () => {
    const result = convertText('1,000', { ...DEFAULT_OPTIONS, handleComma: false });
    expect(result).not.toBe('千');
    expect(result).toBe('一,〇');
  });

  it('handleComma=true converts comma-separated numbers (default)', () => {
    const result = convertText('1,000,000円', { ...DEFAULT_OPTIONS, handleComma: true });
    expect(result).toBe('百万円');
  });
});

describe('convertText - edge cases', () => {
  it('handles empty string', () => {
    expect(convertText('', DEFAULT_OPTIONS)).toBe('');
  });

  it('handles NaN-like text', () => {
    expect(convertText('NaN', DEFAULT_OPTIONS)).toBe('NaN');
  });

  it('handles negative sign prefix', () => {
    expect(convertText('-5', DEFAULT_OPTIONS)).toBe('-五');
  });

  it('converts digit after dot when no leading digit (.5 → .五)', () => {
    // NUMBER_PATTERNは \d+ にマッチするため、.の後の5は変換される
    expect(convertText('.5', DEFAULT_OPTIONS)).toBe('.五');
  });

  it('handles text with no numbers', () => {
    expect(convertText('漢字テスト', DEFAULT_OPTIONS)).toBe('漢字テスト');
  });
});
