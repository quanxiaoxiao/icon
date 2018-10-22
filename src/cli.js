const path = require('path');
const fs = require('fs');
const icon = require('./icon');


const configPathname = path.resolve(process.cwd(), '.iconfont');

const config = JSON.parse(fs.readFileSync(configPathname));

icon(config);
