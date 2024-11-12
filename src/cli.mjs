import process from 'node:process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import runFetch from './fetch.mjs';
import getPackageInfo from './getPackageInfo.mjs';
import brower from './brower.mjs';

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
