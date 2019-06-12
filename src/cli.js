const yargs = require('yargs');
const path = require('path');
const https = require('https');
const fs = require('fs');
const onFinished = require('on-finished');
const {
  of,
  fromEvent,
  bindNodeCallback,
  merge,
} = require('rxjs');
const {
  map,
  switchMap,
  buffer,
  tap,
  first,
  skip,
} = require('rxjs/operators');
const getIconData = require('./getIconData');

const pkg = require('../package.json');

yargs
  .option('color', {
    alias: 'c',
    default: '#ccc',
  })
  .version(pkg.version);

of(path.resolve(process.cwd(), '.iconfont'))
  .pipe(
    map(pathname => JSON.parse(fs.readFileSync(pathname))),
    switchMap(({ pid, ctoken, cookie }) => of(https.request({
      hostname: 'www.iconfont.cn',
      port: 443,
      method: 'GET',
      path: `/api/project/detail.json?pid=${pid}&t=${Date.now()}&ctoken=${ctoken}`,
      headers: {
        Cookie: cookie,
      },
    }))),
    switchMap(req => merge(
      fromEvent(req, 'response'),
      of(req)
        .pipe(
          tap(() => {
            req.end();
          }),
          first(),
          skip(1),
        ),
    )),
    switchMap(res => merge(fromEvent(res, 'data')
      .pipe(
        buffer(bindNodeCallback(onFinished)(res)),
        map(buf => Buffer.concat(buf).toString()),
        map(str => JSON.parse(str)),
        map(obj => obj.data.icons),
        map(list => list.map(item => ({
          code: Number(item.unicode).toString(16),
          ...getIconData(item.show_svg),
        }))),
        map(list => list.reduce((acc, cur) => ({
          ...acc,
          [cur.code]: cur,
        }), {})),
        tap((obj) => {
          console.log(`create icon count: ${Object.keys(obj).length}`);
        }),
        map(obj => JSON.stringify(obj)),
      ))),
  )
  .subscribe((data) => {
    const destDir = path.resolve(process.cwd(), 'data');
    try {
      const stat = fs.statSync(destDir);
      if (!stat.isDirectory()) {
        throw new Error();
      }
    } catch (err) {
      fs.mkdirSync(destDir);
    }
    fs.writeFileSync(path.resolve(destDir, 'icons.json'), data);
  });
