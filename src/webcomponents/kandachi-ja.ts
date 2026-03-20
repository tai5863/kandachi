import type { ConversionMode, KandachiOptions } from '../types.js';
import { DEFAULT_OPTIONS } from '../types.js';
import { convertText } from '../converter.js';
import { resolveTcyOptions } from '../tcy.js';

export class KandachiJaElement extends HTMLElement {
  static get observedAttributes() {
    return ['mode', 'tcy', 'tcy-max', 'tcy-class'];
  }

  private _original: string = '';
  private _observer: MutationObserver | null = null;

  connectedCallback() {
    this._original = this.textContent ?? '';
    this._render();
    this._setupObserver();
  }

  disconnectedCallback() {
    this._observer?.disconnect();
    this._observer = null;
  }

  attributeChangedCallback() {
    this._render();
  }

  private _getOptions(): Partial<KandachiOptions> {
    const mode = (this.getAttribute('mode') as ConversionMode) ?? DEFAULT_OPTIONS.mode;
    const hasTcy = this.hasAttribute('tcy');
    const tcyMax = this.getAttribute('tcy-max');
    const tcyClass = this.getAttribute('tcy-class');

    const tcy = hasTcy
      ? {
          enabled: true,
          ...(tcyMax ? { maxDigits: Number(tcyMax) } : {}),
          ...(tcyClass ? { className: tcyClass } : {}),
        }
      : false;

    return { mode, tcy };
  }

  private _render() {
    if (!this._original) {
      this._original = this.textContent ?? '';
    }
    if (!this._original) return;

    const options: KandachiOptions = { ...DEFAULT_OPTIONS, ...this._getOptions() };
    const tcyOpts = resolveTcyOptions(options.tcy);

    const result = convertText(this._original, options);

    // Observer切断 → DOM更新 → Observer再接続で二重変換を防止
    this._observer?.disconnect();
    if (tcyOpts.enabled && result.includes('<')) {
      this.innerHTML = result;
    } else {
      this.textContent = result;
    }
    this._reconnectObserver();
  }

  private _setupObserver() {
    this._observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          this._original = this.textContent ?? '';
          this._render();
          break;
        }
      }
    });

    this._reconnectObserver();
  }

  private _reconnectObserver() {
    this._observer?.observe(this, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }
}

if (typeof customElements !== 'undefined') {
  customElements.define('kandachi-ja', KandachiJaElement);
}
