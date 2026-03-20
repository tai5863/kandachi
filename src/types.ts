export type ConversionMode = 'standard' | 'positional' | 'formal' | 'simple';

export interface TcyOptions {
  enabled: boolean;
  maxDigits: number;
  className: string;
  tag: string;
}

export interface KandachiOptions {
  mode: ConversionMode;
  tcy: boolean | Partial<TcyOptions>;
  handleComma: boolean;
  handleDecimal: boolean;
}

export const DEFAULT_TCY_OPTIONS: TcyOptions = {
  enabled: false,
  maxDigits: 2,
  className: 'tcy',
  tag: 'span',
};

export const DEFAULT_OPTIONS: KandachiOptions = {
  mode: 'standard',
  tcy: false,
  handleComma: true,
  handleDecimal: true,
};
