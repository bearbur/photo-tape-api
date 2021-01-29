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
/*Routing*/
app.use(router_1.default);
/* start the Express server */
app.listen(port, function () {
    /* tslint:disable */
    console.log("server started at http://localhost:" + port);
    /* tslint:enable */
});
//# sourceMappingURL=index.js.map