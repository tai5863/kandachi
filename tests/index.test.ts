import { describe, it, expect } from 'vitest';
import { format, Kandachi, toKanji } from '../src/index.js';

describe('format()', () => {
  it('formats text with default options', () => {
    expect(format('12500円')).toBe('一万二千五百円');
  });

  it('formats with positional mode', () => {
    expect(format('2026年3月20日', { mode: 'positional' })).toBe('二〇二六年三月二〇日');
  });

  it('formats with tcy', () => {
    expect(format('12月25日', { tcy: true }))
      .toBe('<span class="tcy">12</span>月<span class="tcy">25</span>日');
  });
});

describe('Kandachi class', () => {
  it('reuses options', () => {
    const k = new Kandachi({ mode: 'positional' });
    expect(k.format('2026年')).toBe('二〇二六年');
    expect(k.format('100円')).toBe('一〇〇円');
  });

  it('provides toKanji method', () => {
    const k = new Kandachi({ mode: 'standard' });
    expect(k.toKanji(12500)).toBe('一万二千五百');
    expect(k.toKanji(2026, 'positional')).toBe('二〇二六');
  });
});

describe('toKanji re-export', () => {
  it('works as standalone export', () => {
    expect(toKanji(42)).toBe('四十二');
  });
});
