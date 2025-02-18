import open from 'open';

import getConfig from './getConfig.mjs';

export default async () => {
  const config = getConfig();
  await open(`https://www.iconfont.cn/manage/index?manage_type=myprojects&projectId=${config.pid}`);
};
