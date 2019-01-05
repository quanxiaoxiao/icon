const yargs = require('yargs');
const path = require('path');
const fs = require('fs');
const icon = require('./icon');

const pkg = require('../package.json');

const {
  argv: { color },
} = yargs
  .option('color', {
    alias: 'c',
    default: '#ccc',
  })
  .version(pkg.version);

const configPathname = path.resolve(process.cwd(), '.iconfont');

const config = JSON.parse(fs.readFileSync(configPathname));

icon(config, color);
