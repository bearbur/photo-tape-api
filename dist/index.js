"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var compression_1 = __importDefault(require("compression"));
var helmet_1 = __importDefault(require("helmet"));
var router_1 = __importDefault(require("./router"));
var logger_1 = require("./core/services/logger/logger");
var db_mongo_1 = __importDefault(require("./config/db-mongo"));
var db_setting_check_1 = __importDefault(require("./core/services/admin/db-setting-check"));
var http_codes_1 = __importDefault(require("./core/constants/http-codes"));
var utils_constants_1 = require("./core/constants/utils-constants");
var cors_1 = __importDefault(require("cors"));
var environment = process.env.NODE_ENV;
var app = express_1.default();
/* default port to listen*/
var PORT = 8080;
var HOST = '0.0.0.0';
if (environment.toLowerCase() === 'development') {
    logger_1.loggerCreator.info('Dev mode.');
    app.use(cors_1.default());
}
app.use(helmet_1.default());
app.use(compression_1.default());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
/* Set special headers for CORS */
app.use(function (req, res, next) {
    if (environment.toLowerCase() !== 'development') {
        logger_1.loggerCreator.info('Prod mode.');
        res.append('Access-Control-Allow-Origin', '*');
    }
    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
/*Database connection - set up default mongoose connection*/
db_mongo_1.default()
    .then(function () {
    logger_1.loggerCreator.info("Server DB connection success.");
})
    .catch(function () {
    logger_1.loggerCreator.error("Server DB catch error.");
});
/*Routing*/
app.use(router_1.default);
/*Tasks*/
db_setting_check_1.default();
app.use(function (err, req, res, next) {
    logger_1.loggerCreator.error(err.stack.toString().slice(utils_constants_1.MIN_ERROR_LENGTH, utils_constants_1.MAX_ERROR_LENGTH));
    res.status(http_codes_1.default.badRequest).send({ error: 'Something wrong!' });
});
/* start the Express server */
app.listen(PORT, HOST, function () {
    logger_1.loggerCreator.info("Server started at http://" + HOST + ":" + PORT);
});
//# sourceMappingURL=index.js.map