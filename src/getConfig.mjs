import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import shelljs from 'shelljs';

export default () => {
  const pathname = path.resolve(process.cwd(), '.iconfont');
  if (!shelljs.test('-f', pathname)) {
    console.warn(`\`${pathname}\` not found config`);
    process.exec(1);
  }
  const config = JSON.parse(fs.readFileSync(pathname));
  return {
    pid: config.pid,
    cookie: config.cookie,
    ctoken: config.ctoken,
    output: {
      dir: config.output?.dir ?? '',
      name: config.output?.name ?? 'icons.json',
    },
  };
};
