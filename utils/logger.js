const log4js = require('log4js');

// Configure logs
log4js.configure({
    appenders: {
        multi: { type: 'multiFile', base: 'logs/', property: 'categoryName', extension: '.log' }
    },
    categories: { default: { appenders: ['multi'], level: 'debug' } }
});

// Initialize the loggers for use
const logger = {
    logInfo: log4js.getLogger('info'),
    logError: log4js.getLogger('error'),
    logDebug: log4js.getLogger('debug'),
    logAccess: log4js.getLogger('access')
};
    
module.exports = logger;