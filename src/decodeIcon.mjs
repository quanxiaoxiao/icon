import * as cheerio from 'cheerio';

export default (str) => {
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
