import { NextFunction, Request, Response } from 'express';
import httpCodes from '../../constants/http-codes';
import { UserRegReqObject, UserRegReqObjectBody } from '../../interfaces/user-interfaces';
import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '../../constants/user-conditions-constants';
import { loggerCreator } from '../../services/logger/logger';

/*Will be check precondition for login endpoint*/
export const checkLoginBodyHandler = (req: UserRegReqObject, res: Response, next: NextFunction) => {
    const missParametersHandler = (warningParameters: string): void => {
        res.status(httpCodes.badRequest);
        res.send({ error: `Need for login: ${warningParameters}.` });
    };

    const reqBody = req.body;
    if (!reqBody) {
        missParametersHandler('Miss body JSON objects');

        return;
    }

    const { username, password } = reqBody;

    if (!username) {
        missParametersHandler('Please add username at body JSON object');

        return;
    }

    if (!password) {
        missParametersHandler('Please add password at body JSON object');

        return;
    }

    next();
};
export const userRegistrationCheckBody = (req: UserRegReqObject, res: Response, next: NextFunction) => {
    const reqObject: UserRegReqObjectBody = req.body;
    const username: string = reqObject.username;
    const password: string = reqObject.password;

    /* Check username and password for minimum correct conditions (exist and not less than minimum conditions). */
    if (!username || !password) {
        res.status(httpCodes.badRequest);
        res.send({ error: 'Please, send username and password at the request body.' });

        return;
    }

    if (username.length <= MIN_USERNAME_LENGTH || password.length <= MIN_PASSWORD_LENGTH) {
        res.status(httpCodes.badRequest);
        res.send({
            error: `Minimum length of username is ${MIN_USERNAME_LENGTH} symbols. Minimum length of username is ${MIN_PASSWORD_LENGTH} symbols.`,
        });

        return;
    }

    next();
};
export const userCheckAuthTokenBody = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];


    if (!token || !authHeader) {


    loggerCreator.error(`Login body authHeader incorrect`);
    

        res.status(httpCodes.noAuth);
        res.send({ error: 'No auth header.' });

        return;
    }

    next();
};

export const checkChangePasswordBody = (req: UserRegReqObject, res: Response, next: NextFunction) => {

    const reqObject: UserRegReqObjectBody = req.body;

    const password: string = reqObject.password;

      /* Check password for minimum correct conditions (exist and not less than minimum conditions). */
        if (!password) {
            res.status(httpCodes.badRequest);
            res.send({ error: 'Please, send password at the request body.' });
    
            return;
        }
    
        if ( password.length <= MIN_PASSWORD_LENGTH) {
            res.status(httpCodes.badRequest);
            res.send({
                error: `Minimum length of username is ${MIN_PASSWORD_LENGTH} symbols.`,
            });
    
            return;
        }
    
        next();

}