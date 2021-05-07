import { NextFunction, Request, Response } from 'express';
import httpCodes from '../../constants/http-codes';
import { UserRegReqObject, UserRegReqObjectBody } from '../../interfaces/user-interfaces';
import { MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH } from '../../constants/user-conditions-constants';

/*Will be check precondition for login endpoint*/
export const checkLoginBodyHandler = (
    req: { body: { username: string; password: string } },
    res: Response,
    next: NextFunction
) => {
    const missParametersHandler = (warningParameters: string): void => {
        res.status(httpCodes.badRequest);
        res.send({ error: `Need for login: ${warningParameters}.` });

        return;
    };

    const reqBody = req.body;
    if (!reqBody) {
        missParametersHandler('body object');
    }

    const { username, password } = reqBody;

    if (!username) {
        missParametersHandler('user username at body object');
    }

    if (!password) {
        missParametersHandler('user password at body object');
    }

    next();
};
export const userRegCheckBody = (req: UserRegReqObject, res: Response, next: NextFunction) => {
    const reqObject: UserRegReqObjectBody = req.body;
    const username: string = reqObject.username;
    const password: string = reqObject.password;

    /* Check login and password for minimum correct conditions (exist and not less than minimum conditions */
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
        res.status(httpCodes.noAuth);
        res.send({ error: 'No auth header.' });

        return;
    }

    next();
};
