const checker = require('./checker');
const { wrapError, CheckError, CheckInfo, CheckWarning } = require('./errors');



module.exports = checker;
module.exports.CheckInfo = wrapError(CheckInfo);
module.exports.CheckError = wrapError(CheckError);
module.exports.CheckWarning = wrapError(CheckWarning);
