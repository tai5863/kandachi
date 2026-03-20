import { describe, it, expect, beforeAll } from 'vitest';

describe('KandachiJaElement', () => {
  beforeAll(async () => {
    await import('../src/webcomponents/kandachi-ja.js');
  });

  it('registers custom element', () => {
    expect(customElements.get('kandachi-ja')).toBeDefined();
  });

  it('converts text on connect (default standard mode)', async () => {
    const el = document.createElement('kandachi-ja');
    el.textContent = '12500円';
    document.body.appendChild(el);

    // Wait for connectedCallback
    await new Promise((r) => setTimeout(r, 0));
    expect(el.textContent).toBe('一万二千五百円');

    el.remove();
  });

  it('respects mode attribute', async () => {
    const el = document.createElement('kandachi-ja');
    el.setAttribute('mode', 'positional');
    el.textContent = '2026年';
    document.body.appendChild(el);

    await new Promise((r) => setTimeout(r, 0));
    expect(el.textContent).toBe('二〇二六年');

    el.remove();
  });

  it('handles tcy attribute', async () => {
    const el = document.createElement('kandachi-ja');
    el.setAttribute('tcy', '');
    el.textContent = '12月25日';
    document.body.appendChild(el);

    await new Promise((r) => setTimeout(r, 0));
    expect(el.innerHTML).toContain('class="tcy"');
    expect(el.innerHTML).toContain('12');
    expect(el.innerHTML).toContain('25');

    el.remove();
  });

  it('responds to attribute changes', async () => {
    const el = document.createElement('kandachi-ja');
    el.setAttribute('mode', 'positional');
    el.textContent = '2026年';
    document.body.appendChild(el);

    await new Promise((r) => setTimeout(r, 0));
    expect(el.textContent).toBe('二〇二六年');

    // Change mode
    el.setAttribute('mode', 'simple');
    await new Promise((r) => setTimeout(r, 0));
    expect(el.textContent).toBe('二〇二六年'); // simple and positional same output

    el.remove();
  });
});
