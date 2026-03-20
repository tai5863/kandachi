import { describe, it, expect } from 'vitest';
import { toSimple } from '../src/modes/simple.js';
import { toPositional } from '../src/modes/positional.js';
import { toStandard } from '../src/modes/standard.js';
import { toFormal } from '../src/modes/formal.js';

describe('simple mode', () => {
  it('converts single digit', () => {
    expect(toSimple('0')).toBe('〇');
    expect(toSimple('5')).toBe('五');
    expect(toSimple('9')).toBe('九');
  });

  it('converts multi-digit numbers', () => {
    expect(toSimple('1234')).toBe('一二三四');
    expect(toSimple('2026')).toBe('二〇二六');
  });

  it('handles decimal', () => {
    expect(toSimple('3', '14')).toBe('三・一四');
  });
});

describe('positional mode', () => {
  it('converts with zero as 〇', () => {
    expect(toPositional('2026')).toBe('二〇二六');
    expect(toPositional('100')).toBe('一〇〇');
    expect(toPositional('0')).toBe('〇');
  });
});

describe('standard mode', () => {
  it('converts zero', () => {
    expect(toStandard('0')).toBe('〇');
  });

  it('converts single digits', () => {
    expect(toStandard('1')).toBe('一');
    expect(toStandard('5')).toBe('五');
  });

  it('converts tens', () => {
    expect(toStandard('10')).toBe('十');
    expect(toStandard('11')).toBe('十一');
    expect(toStandard('20')).toBe('二十');
    expect(toStandard('99')).toBe('九十九');
  });

  it('converts hundreds', () => {
    expect(toStandard('100')).toBe('百');
    expect(toStandard('123')).toBe('百二十三');
    expect(toStandard('500')).toBe('五百');
  });

  it('converts thousands', () => {
    expect(toStandard('1000')).toBe('千');
    expect(toStandard('1234')).toBe('千二百三十四');
    expect(toStandard('9999')).toBe('九千九百九十九');
  });

  it('converts ten-thousands (万)', () => {
    expect(toStandard('10000')).toBe('一万');
    expect(toStandard('12500')).toBe('一万二千五百');
    expect(toStandard('100000')).toBe('十万');
  });

  it('converts 億', () => {
    expect(toStandard('100000000')).toBe('一億');
    expect(toStandard('123456789')).toBe('一億二千三百四十五万六千七百八十九');
  });

  it('converts 兆', () => {
    expect(toStandard('1000000000000')).toBe('一兆');
  });

  it('handles decimal', () => {
    expect(toStandard('3', '14')).toBe('三・一四');
  });
});

describe('standard mode - edge cases', () => {
  it('converts 京 (10^16)', () => {
    expect(toStandard('10000000000000000')).toBe('一京');
  });

  it('converts 垓 (10^20)', () => {
    expect(toStandard('100000000000000000000')).toBe('一垓');
  });

  it('falls back to simple for numbers beyond 垓', () => {
    const huge = '1' + '0'.repeat(24);
    const result = toStandard(huge);
    expect(result).not.toContain('undefined');
    expect(result).toBe('一〇〇〇〇〇〇〇〇〇〇〇〇〇〇〇〇〇〇〇〇〇〇〇〇');
  });

  it('handles leading zeros', () => {
    expect(toStandard('007')).toBe('七');
  });
});

describe('simple mode - edge cases', () => {
  it('handles leading zeros', () => {
    expect(toSimple('007')).toBe('〇〇七');
  });
});

describe('formal mode', () => {
  it('converts zero', () => {
    expect(toFormal('0')).toBe('零');
  });

  it('converts basic numbers', () => {
    expect(toFormal('1')).toBe('壱');
    expect(toFormal('12')).toBe('壱拾弐');
    expect(toFormal('100')).toBe('壱佰');
  });

  it('converts with large units', () => {
    expect(toFormal('12500')).toBe('壱萬弐仟伍佰');
    expect(toFormal('1000')).toBe('壱仟');
  });

  it('handles decimal', () => {
    expect(toFormal('3', '14')).toBe('参・壱肆');
  });

  it('converts 京 (10^16)', () => {
    expect(toFormal('10000000000000000')).toBe('壱京');
  });

  it('falls back to simple for numbers beyond 垓', () => {
    const huge = '1' + '0'.repeat(24);
    const result = toFormal(huge);
    expect(result).not.toContain('undefined');
  });
});
