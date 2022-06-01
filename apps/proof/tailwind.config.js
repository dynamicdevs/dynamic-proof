const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const themeHorizon = require('../../settings/tailwind/horizon/galaxy');
const { join } = require('path');

module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: themeHorizon,
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
};
