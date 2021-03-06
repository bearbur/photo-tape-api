import express from "express";
import bodyParser from 'body-parser';
import winston from "winston";
import expressWinston from "express-winston";
import routerApp from './router';
import {loggerCreator} from "./core/services/logger/logger";
import InitiateMongoServer from "./config/db-mongo";

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

/*Database connection - set up default mongoose connection*/
InitiateMongoServer().then(()=>{
    loggerCreator.info( `Server DB connection success.` );
}).catch(()=>{
    loggerCreator.error( `Server DB catch error.` );
});


/*Routing*/
app.use( routerApp);

/* start the Express server */
app.listen( port, () => {
    /* tslint:disable */
    loggerCreator.info(  `Server started at http://localhost:${ port }`  );
    /* tslint:enable */
} );


