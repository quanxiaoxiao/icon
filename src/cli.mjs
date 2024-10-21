import process from 'node:process';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import runFetch from './fetch.mjs';
import display from './display.mjs';
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
    'display',
    'open brower at project in iconfont',
    {},
    () => {
      display();
    },
  )
  .version(getPackageInfo().version)
  .parse();
