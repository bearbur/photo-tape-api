import express from "express";
import winston from "winston";
import expressWinston from "express-winston"
const app = express();
const port = 8080; // default port to listen


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

// define a route handler for the default home page
app.get( "/", ( req, res ) => {
    res.send( "Hello world!" );
} );

// start the Express server
app.listen( port, () => {
    /* tslint:disable */
    console.log( `server started at http://localhost:${ port }` );
    /* tslint:enable */
} );
