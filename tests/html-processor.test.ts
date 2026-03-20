import { describe, it, expect } from 'vitest';
import { formatHTML } from '../src/html-processor.js';

describe('formatHTML', () => {
  it('converts numbers in plain text', () => {
    expect(formatHTML('2026年', { mode: 'positional' })).toBe('二〇二六年');
  });

  it('preserves HTML tags', () => {
    const result = formatHTML('<p>2026年</p>', { mode: 'positional' });
    expect(result).toBe('<p>二〇二六年</p>');
  });

  it('does not modify tag attributes', () => {
    const result = formatHTML('<div data-value="100">200円</div>', { mode: 'standard' });
    expect(result).toBe('<div data-value="100">二百円</div>');
  });

  it('handles nested HTML', () => {
    const result = formatHTML('<div><span>12500</span>円</div>', { mode: 'standard' });
    expect(result).toBe('<div><span>一万二千五百</span>円</div>');
  });

  it('handles TCY in HTML', () => {
    const result = formatHTML('<p>12月25日</p>', { tcy: true });
    expect(result).toBe('<p><span class="tcy">12</span>月<span class="tcy">25</span>日</p>');
  });

  it('handles text before and after tags', () => {
    const result = formatHTML('前100<br>後200', { mode: 'standard' });
    expect(result).toBe('前百<br>後二百');
  });

  it('preserves empty tags', () => {
    const result = formatHTML('<br/><img src="a.png"/>', { mode: 'standard' });
    expect(result).toBe('<br/><img src="a.png"/>');
  });
});
