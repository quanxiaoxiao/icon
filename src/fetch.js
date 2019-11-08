const path = require('path');
const shelljs = require('shelljs');
const cheerio = require('cheerio');
const https = require('https');
const fp = require('lodash/fp');
const fs = require('fs');
const getConfig = require('./getConfig');

const getIconData = (str) => {
  const $ = cheerio.load(str);
  return {
    viewBox: $('svg').attr('viewBox'),
    paths: $('path').map((i, item) => ({
      d: $(item).attr('d'),
      ...$(item).attr('fill') ? {
        fill: $(item).attr('fill'),
      } : {},
    })).get(),
  };
};

module.exports = () => {
  const config = getConfig();

  const req = https.request({
    hostname: 'www.iconfont.cn',
    port: 443,
    method: 'GET',
    path: `/api/project/detail.json?pid=${config.pid}&t=${Date.now()}&ctoken=${config.ctoken}`,
    headers: {
      Cookie: config.cookie,
    },
  });

  req.once('response', (res) => {
    const buf = [];
    res.on('data', (chunk) => {
      buf.push(chunk);
    });
    res.once('end', () => {
      const result = fp.compose(
        fp.reduce((acc, cur) => ({
          ...acc,
          [cur.code]: cur,
        }), {}),
        fp.map((item) => ({
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

  req.once('error', () => {
    console.log('fetch error');
  });

  req.end();
};
