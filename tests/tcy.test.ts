import { describe, it, expect } from 'vitest';
import { wrapTcy, resolveTcyOptions } from '../src/tcy.js';

describe('resolveTcyOptions', () => {
  it('resolves boolean true', () => {
    const opts = resolveTcyOptions(true);
    expect(opts.enabled).toBe(true);
    expect(opts.maxDigits).toBe(2);
    expect(opts.className).toBe('tcy');
    expect(opts.tag).toBe('span');
  });

  it('resolves boolean false', () => {
    const opts = resolveTcyOptions(false);
    expect(opts.enabled).toBe(false);
  });

  it('resolves partial options', () => {
    const opts = resolveTcyOptions({ maxDigits: 3, className: 'custom' });
    expect(opts.enabled).toBe(true);
    expect(opts.maxDigits).toBe(3);
    expect(opts.className).toBe('custom');
    expect(opts.tag).toBe('span');
  });
});

describe('wrapTcy', () => {
  it('wraps text with default options', () => {
    const result = wrapTcy('12', { enabled: true, maxDigits: 2, className: 'tcy', tag: 'span' });
    expect(result).toBe('<span class="tcy">12</span>');
  });

  it('wraps with custom tag and class', () => {
    const result = wrapTcy('25', { enabled: true, maxDigits: 2, className: 'v-num', tag: 'em' });
    expect(result).toBe('<em class="v-num">25</em>');
  });

  it('escapes HTML in className to prevent XSS', () => {
    const result = wrapTcy('12', {
      enabled: true,
      maxDigits: 2,
      className: '"><script>alert(1)</script><span class="',
      tag: 'span',
    });
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });

  it('escapes HTML in tag name', () => {
    const result = wrapTcy('12', {
      enabled: true,
      maxDigits: 2,
      className: 'tcy',
      tag: 'script><img src=x onerror=alert(1)><span',
    });
    expect(result).not.toContain('<script>');
  });
});
