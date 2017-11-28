/*eslint-env node*/

const through = require('through2');
const chalk = require('chalk');
const { BasicCheckError, SystemError } = require('./errors');



module.exports = ({
  name = 'Check',
  map = (file) => file,
  checkers = []
} = {}) => {
  let objects = [];

  return through.obj((file, encoding, callback) => {
    if (!file.isBuffer()) {
      callback(null, file);
      return;
    }

    const fObj = map(file);

    const prepareErrors = (err) =>
      (Array.isArray(err) ? err : [ err ]).map((err) => {
        if (!err) {
          return null;
        }

        if (err instanceof BasicCheckError) {
          return err;
        }

        return new SystemError(err.message);
      });

    const problems = checkers.map((checker) => {
      let err = null;

      try {
        err = checker(fObj);
      } catch (_err) {
        err = _err;
      }

      return prepareErrors(err);
    })
      .reduce((sum, list) => [ ...sum, ...list ], []).filter(Boolean);

    objects.push({
      file,
      object: fObj,
      problems
    });

    callback(null, file);
  }, (callback) => {
    const allObjects = objects;

    objects = [];

    const problemObjects = allObjects.filter(({ problems }) => problems.length);


    problemObjects.forEach(({ problems, object, file }) => {
      if (problems.length) {
        console.log(`problems in ${chalk.blue(`"${object.name || file.relative}"`)}:${problems.map((err) => err.format('\n- ', ';')).join('')}`); // eslint-disable-line no-console
      }
    });

    const objectsWithCriticalErrors = problemObjects.filter(({ problems }) => problems.some((err) => err.isCritical()));
    const objectsWithNotCriticalErrors = problemObjects.filter(({ problems }) => !problems.some((err) => err.isCritical()));

    if (problemObjects.length) {
      console.log(`${name}: ${chalk.red(objectsWithCriticalErrors.length)} critical, ${chalk.yellow(objectsWithNotCriticalErrors.length)} not critical`); // eslint-disable-line no-console
    }

    if (objectsWithCriticalErrors.length) {
      callback(`${name} has errors`);
    } else {
      callback();
    }
  });
};
