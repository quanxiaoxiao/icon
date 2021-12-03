const open = require('open');
const getConfig = require('./getConfig');

module.exports = () => {
  const config = getConfig();
  open(`https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=${config.pid}`);
};
