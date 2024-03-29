import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import routerApp from './router';
import { loggerCreator } from './core/services/logger/logger';
import InitiateMongoServer from './config/db-mongo';
import dataBaseSettingsCheck from './core/services/admin/db-setting-check';
import httpCodes from './core/constants/http-codes';
import { MAX_ERROR_LENGTH, MIN_ERROR_LENGTH } from './core/constants/utils-constants';
import cors from 'cors';

const environment = process.env.NODE_ENV;

const app = express();

/* default port to listen*/
const PORT = 8080;
const HOST = '0.0.0.0';

if (environment.toLowerCase() === 'development') {
    loggerCreator.info('Dev mode.');
    app.use(cors());
}

app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

/* Set special headers for CORS */
app.use((req, res, next) => {
    if (environment.toLowerCase() !== 'development') {
        loggerCreator.info('Prod mode.');
        res.append('Access-Control-Allow-Origin', '*');
    }

    res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.append('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

/*Database connection - set up default mongoose connection*/
InitiateMongoServer()
    .then(() => {
        loggerCreator.info(`Server DB connection success.`);
    })
    .catch(() => {
        loggerCreator.error(`Server DB catch error.`);
    });

/*Routing*/
app.use(routerApp);

/*Tasks*/

dataBaseSettingsCheck();

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    loggerCreator.error(err.stack.toString().slice(MIN_ERROR_LENGTH, MAX_ERROR_LENGTH));
    res.status(httpCodes.badRequest).send({ error: 'Something wrong!' });
});

/* start the Express server */
app.listen(PORT, HOST, () => {
    loggerCreator.info(`Server started at http://${HOST}:${PORT}`);
});
