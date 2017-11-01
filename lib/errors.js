const chalk = require('chalk');



class BasicCheckError extends Error {
  constructor (message, ...args) {
    super(message, ...args);
  }
  isCritical () {
    return true;
  }
  toString () {
    return this.format();
  }
  color () {
    return 'red';
  }
  suffix () {
    return 'error';
  }
  format (pref = '', suf = '') {
    if (this.isCritical()) {
      return chalk[this.color()](`${pref}${this.message} [${this.suffix()}]${suf}`);
    }
    return `${pref}${this.message} ${chalk[this.color()](`[${this.suffix()}]`)}${suf}`;
  }
}

exports.SystemError = class SystemError extends BasicCheckError {
  suffix () {
    return '!!!TROWED ERROR!!!';
  }
};

exports.CheckError = class CheckError extends BasicCheckError {};

exports.CheckWarning = class CheckWarning extends BasicCheckError {
  color () {
    return 'yellow';
  }
  isCritical () {
    return false;
  }
  suffix () {
    return 'warning';
  }
};

exports.CheckInfo = class CheckInfo extends BasicCheckError {
  color () {
    return 'cyan';
  }
  isCritical () {
    return false;
  }
  suffix () {
    return 'info';
  }
};


exports.wrapError = (Error) => function (...args) {
  return new Error(...args);
};

