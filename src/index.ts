import { Parser } from './Parser';
import * as fs from 'fs';

function main(argv: string[]) {
  const [, , mode, exp] = argv;
  const parser = new Parser();

  let ast = null;

  if (mode === '-e') {
    ast = parser.parse(exp);
  }

  if (mode === '-f') {
    const src = fs.readFileSync(exp, 'utf-8');
    ast = parser.parse(src);
  }

  console.log(JSON.stringify(ast, null, 2));
}

main(process.argv);
