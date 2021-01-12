"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var winston_1 = __importDefault(require("winston"));
var express_winston_1 = __importDefault(require("express-winston"));
var app = express_1.default();
var port = 8080; // default port to listen
app.use(express_winston_1.default.logger({
    transports: [
        new winston_1.default.transports.Console()
    ],
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json()),
    expressFormat: true,
    colorize: false
}));
// 1. route for posts
// 01. get all posts
app.get("/api/posts", function (req, res) { return res.send([
    { id: 1, title: 'Oh boy!', payload: "This was funny", date: new Date(), author: 'admin' }
]); });
// define a route handler for the default home page
app.get("/", function (req, res) {
    res.send("Hello world!");
});
// start the Express server
app.listen(port, function () {
    /* tslint:disable */
    console.log("server started at http://localhost:" + port);
    /* tslint:enable */
});
//# sourceMappingURL=index.js.map