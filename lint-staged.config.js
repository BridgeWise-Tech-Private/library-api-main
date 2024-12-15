/* eslint-disable @typescript-eslint/explicit-function-return-type */
export default {
  'package.json': 'sort-package-json',
  '*.{ts,tsx}': 'eslint --max-warnings=0 . --ext=.ts --fix',
  '**/*.ts?(x)': () => 'tsx --tsconfig tsconfig.json',
};
