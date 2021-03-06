"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var winston_1 = __importDefault(require("winston"));
var express_winston_1 = __importDefault(require("express-winston"));
var router_1 = __importDefault(require("./router"));
var logger_1 = require("./core/services/logger/logger");
var db_mongo_1 = __importDefault(require("./config/db-mongo"));
var app = express_1.default();
/* default port to listen*/
var port = 8080;
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_winston_1.default.logger({
    transports: [
        new winston_1.default.transports.Console()
    ],
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json()),
    expressFormat: true,
    colorize: false
}));
app.use(express_1.default.json());
/*Database connection - set up default mongoose connection*/
db_mongo_1.default().then(function () {
    logger_1.loggerCreator.info("Server DB connection success.");
}).catch(function () {
    logger_1.loggerCreator.error("Server DB catch error.");
});
/*Routing*/
app.use(router_1.default);
/* start the Express server */
app.listen(port, function () {
    /* tslint:disable */
    logger_1.loggerCreator.info("Server started at http://localhost:" + port);
    /* tslint:enable */
});
//# sourceMappingURL=index.js.map