import process from 'node:process';

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import brower from './brower.mjs';
import runFetch from './fetch.mjs';
import getPackageInfo from './getPackageInfo.mjs';

yargs(hideBin(process.argv))
  .command(
    'fetch',
    'fech icons from iconfont',
    {},
    () => {
      runFetch();
    },
  )
  .command(
    'brower',
    'open brower at project in iconfont',
    {},
    () => {
      brower();
    },
  )
  .version(getPackageInfo().version)
  .parse();
