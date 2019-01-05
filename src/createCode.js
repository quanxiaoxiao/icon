const path = require('path');
const fs = require('fs');
const shelljs = require('shelljs');
const Handlebars = require('handlebars');

const source = `const map = {
{{#this}}
  {{code}}: {
    viewBox: '{{viewBox}}',
    pathList: [
      {{#paths}}
      {
        d: '{{d}}',
        fill: '{{fill}}',
      },
      {{/paths}}
    ],
  },
{{/this}}
};

export default map;
`;

const template = Handlebars.compile(source);

module.exports = (data) => {
  const dest = path.resolve(process.cwd(), 'src', 'components', 'Icon');
  if (shelljs.test('-d', dest)) {
    shelljs.rm('-r', dest);
  }

  shelljs.mkdir('-p', dest);
  fs.writeFileSync(path.join(dest, 'map.js'), template(data));
  shelljs.cp(path.resolve(__dirname, '..', 'templates', '*'), dest);
};
