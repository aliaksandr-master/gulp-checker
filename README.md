[![npm](http://img.shields.io/npm/v/gulp-checker.svg?style=flat-square)](https://www.npmjs.com/package/gulp-checker)
[![npm](http://img.shields.io/npm/l/gulp-checker.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/aliaksandr-master/gulp-checker.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/gulp-checker)
[![devDependency Status](https://david-dm.org/aliaksandr-master/gulp-checker/dev-status.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/gulp-checker#info=devDependencies)
[![peerDependency Status](https://david-dm.org/aliaksandr-master/gulp-checker/peer-status.svg?style=flat-square)](https://david-dm.org/aliaksandr-master/gulp-checker?type=peer)

# gulp-checker

```shell
$ npm install gulp-checker --save-dev
```


```javascript
/*eslint-env node*/

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const check = require('gulp-checker');



module.exports = () =>
  gulp
    .src([ 'filters/*.js' ])
    .pipe(check({
      name: 'Check filters',
      map: (file) => {
        const dir = path.dirname(file.path);
        const name = path.basename(file.path).replace(/\.js$/, '');

        return {
          name,
          hasTestFile: fs.existsSync(path.join(dir, '__tests__', `${name}.test.js`))
        };
      },
      checkers: [
        ({ name }, { CheckError }) => {
          if (!/^[a-z0-9]+[a-z0-9-]+?[a-z0-9]+$/.test(name)) {
            return CheckError('invalid name format');
          }

          return null;
        },
        ({ hasTestFile }, { CheckError }) => {
          if (!hasTestFile) {
            return CheckError('no test file');
          }

          return null;
        }
      ]
    }));
```
