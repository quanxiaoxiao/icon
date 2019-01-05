const cheerio = require('cheerio');

module.exports = (str, color) => {
  const $ = cheerio.load(str);
  return {
    viewBox: $('svg').attr('viewBox'),
    paths: $('path').map((i, item) => ({
      d: $(item).attr('d'),
      fill: $(item).attr('fill') || color,
    })).get(),
  };
};
