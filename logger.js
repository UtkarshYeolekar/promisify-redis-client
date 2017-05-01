const winston = require("winston"),
logger = new (winston.Logger)(
    {
        level:"debug",
        transports:  [
            new (winston.transports.Console)({
                prettyPrint: true,
                colorize: true,
                json: false,
                //handleExceptions : true,
                timestamp: function() {
                    return Date.now();
                },
                // formatter: function(options) {
                //     return options.timestamp() +' '+ options.level.toUpperCase() +' '+ (options.message ? options.message : '') +
                //     (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
                // }
            })
        ],
        exitOnError: false
    }
);

// pretty-print to console
logger.cli();

module.exports = logger;