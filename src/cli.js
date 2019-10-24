const path = require('path');
const shelljs = require('shelljs');
const https = require('https');
const fp = require('lodash/fp');
const fs = require('fs');
const getIconData = require('./getIconData');

const config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '.iconfont')));

const req = https.request({
  hostname: 'www.iconfont.cn',
  port: 443,
  method: 'GET',
  path: `/api/project/detail.json?pid=${config.pid}&t=${Date.now()}&ctoken=${config.ctoken}`,
  headers: {
    Cookie: config.cookie,
  },
});

req.on('response', (res) => {
  const buf = [];
  res.on('data', (chunk) => {
    buf.push(chunk);
  });
  res.on('end', () => {
    const result = fp.compose(
      fp.reduce((acc, cur) => ({
        ...acc,
        [cur.code]: cur,
      }), {}),
      fp.map(item => ({
        code: Number(item.unicode).toString(16),
        ...getIconData(item.show_svg),
      })),
      fp.get('data.icons'),
      JSON.parse,
    )(Buffer.concat(buf));
    const destDir = config.dest ? path.resolve(process.cwd(), config.dest) : process.cwd();
    if (!shelljs.test('-d', destDir)) {
      shelljs.mkdir('-p', destDir);
    }
    fs.writeFileSync(path.resolve(destDir, 'icons.json'), JSON.stringify(result));
    console.log(`create icon count: ${Object.keys(result).length} -> ${path.resolve(destDir, 'icons.json')}`);
  });
});

req.end();
