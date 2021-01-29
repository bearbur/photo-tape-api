import express from "express";
import bodyParser from 'body-parser';
import winston from "winston";
import expressWinston from "express-winston";
import routerApp from './router';

const app = express();

/* default port to listen*/
const port = 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressWinston.logger({
    transports: [
        new winston.transports.Console()
    ],
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
    ),
    expressFormat: true,
    colorize: false
}));

app.use(express.json());

/*Routing*/
app.use( routerApp);

/* start the Express server */
app.listen( port, () => {
    /* tslint:disable */
    console.log( `server started at http://localhost:${ port }` );
    /* tslint:enable */
} );


