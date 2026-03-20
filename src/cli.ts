import type { ConversionMode } from './types.js';
import { convertText } from './converter.js';
import { DEFAULT_OPTIONS } from './types.js';

function parseArgs(args: string[]): { mode: ConversionMode; tcy: boolean; text: string } {
  let mode: ConversionMode = 'standard';
  let tcy = false;
  const texts: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--mode' || arg === '-m') {
      const next = args[++i];
      if (!next) {
        console.error('Error: --mode requires an argument (standard, positional, formal, simple)');
        process.exit(1);
      }
      if (['standard', 'positional', 'formal', 'simple'].includes(next)) {
        mode = next as ConversionMode;
      } else {
        console.error(`Error: unknown mode "${next}". Valid modes: standard, positional, formal, simple`);
        process.exit(1);
      }
    } else if (arg === '--tcy' || arg === '-t') {
      tcy = true;
    } else if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    } else if (!arg.startsWith('-')) {
      texts.push(arg);
    }
  }

  return { mode, tcy, text: texts.join(' ') };
}

function printHelp() {
  console.log(`kandachi — 縦書き日本語数字フォーマッティング

Usage:
  kandachi [options] <text>
  echo "text" | kandachi [options]

Options:
  -m, --mode <mode>  変換モード: standard, positional, formal, simple (default: standard)
  -t, --tcy          縦中横を有効化
  -h, --help         ヘルプを表示`);
}

async function readStdin(): Promise<string> {
  if (process.stdin.isTTY) return '';

  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString('utf-8').trim();
}

async function main() {
  const { mode, tcy, text } = parseArgs(process.argv.slice(2));
  const input = text || (await readStdin());

  if (!input) {
    printHelp();
    process.exit(1);
  }

  const result = convertText(input, {
    ...DEFAULT_OPTIONS,
    mode,
    tcy: tcy ? { enabled: true } : false,
  });

  console.log(result);
}

main();
