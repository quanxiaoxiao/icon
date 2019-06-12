const http = require('http');
const concat = require('concat-stream');
const getIconData = require('./getIconData');
const createCode = require('./createCode');

module.exports = ({ cookie, pid, ctoken }, color) => {
  const req = http.request(({
    hostname: 'www.iconfont.cn',
    port: 80,
    method: 'GET',
    path: `/api/project/detail.json?pid=${pid}&t=${Date.now()}&ctoken=${ctoken}`,
    headers: {
      Cookie: cookie,
    },
  }));
  req.on('response', (res) => {
    res.pipe(concat((data) => {
      const { data: { icons } } = JSON.parse(data);
      const list = icons.map(item => ({
        code: Number(item.unicode).toString(16),
        ...getIconData(item.show_svg),
      }));
      createCode(list);
    }));
  });
  req.end();
};
