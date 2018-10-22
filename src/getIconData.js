const cheerio = require('cheerio');

module.exports = (str) => {
  const $ = cheerio.load(str);
  return {
    viewBox: $('svg').attr('viewBox'),
    paths: $('path').map((i, item) => $(item).attr('d')).get(),
  };
};
