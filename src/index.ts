import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import routerApp from './router';
import { loggerCreator } from './core/services/logger/logger';
import InitiateMongoServer from './config/db-mongo';
import dataBaseSettingsCheck from './core/services/admin/db-setting-check';

const app = express();

/* default port to listen*/
const port = 8080;
app.use(helmet());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

/* Set special headers for CORS */
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', '*');
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

/* start the Express server */
app.listen(port, () => {
    loggerCreator.info(`Server started at http://localhost:${port}`);
});
