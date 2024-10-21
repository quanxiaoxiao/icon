import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import shelljs from 'shelljs';
import fp from 'lodash/fp.js';
import request from '@quanxiaoxiao/http-request';
import { decodeContentToJSON } from '@quanxiaoxiao/http-utils';
import getConfig from './getConfig.mjs';
import decodeIcon from './decodeIcon.mjs';

export default async () => {
  const config = getConfig();
  const responseItem = await request(
    {
      method: 'GET',
      path: `/api/project/detail.json?pid=${config.pid}&t=${Date.now()}&ctoken=${config.ctoken}`,
      headers: {
        cookie: config.cookie,
      },
    },
    {
      rejectUnauthorized: false,
      hostname: 'www.iconfont.cn',
      port: 443,
      protocol: 'https:',
    },
  );
  if (responseItem.statusCode !== 200) {
    console.warn(`fetch data response \`${responseItem.statusCode}\` \`${responseItem.body.toString()}\``);
    process.exit(1);
  }
  const result = fp.compose(
    fp.reduce((acc, cur) => ({
      ...acc,
      [cur.code]: cur,
    }), {}),
    fp.map((item) => ({
      code: Number(item.unicode).toString(16),
      ...decodeIcon(item.show_svg),
    })),
    fp.get('data.icons'),
  )(decodeContentToJSON(responseItem.body, responseItem.headers));
  const destDir = path.resolve(process.cwd(), config.output.dir);
  if (!shelljs.test('-d', destDir)) {
    shelljs.mkdir('-p', destDir);
  }
  fs.writeFileSync(path.resolve(destDir, config.output.name), JSON.stringify(result));
  console.log(`create icon count: ${Object.keys(result).length} -> ${path.resolve(destDir, 'icons.json')}`);
};
