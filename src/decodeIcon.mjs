import * as cheerio from 'cheerio';
import chroma from 'chroma-js';

export default (str) => {
  const $ = cheerio.load(str);
  return {
    viewBox: $('svg').attr('viewBox'),
    paths: $('path').map((i, item) => {
      const d = {
        d: $(item).attr('d'),
      };
      const fill = $(item).attr('fill');
      if (chroma.valid(fill)) {
        d.fill = chroma(fill).hex();
      }
      return d;
    }).get(),
  };
};
