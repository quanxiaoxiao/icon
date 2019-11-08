const fs = require('fs');
const path = require('path');

module.exports = () => {
  const config = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '.iconfont')));
  return config;
};
