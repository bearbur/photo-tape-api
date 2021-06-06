import { NextFunction, Request, Response } from 'express';
import AuthToken from '../../models/auth-token/auth-token-model';
import { loggerCreator } from '../../services/logger/logger';
import httpCodes from '../../constants/http-codes';
import { Error } from 'mongoose';

export const userLogoutAuthToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    /* tslint:disable */
    AuthToken.findOneAndUpdate(
        /* tslint:enable */
        {
            user_token: token,
        },
        { inactive: true },
        {
            returnOriginal: false,
        }
    )
        .then(() => {
            loggerCreator.info('Logout token success.', token);

            res.status(httpCodes.success);
            res.send({ error: false, message: `Successfully logout.` });
        })
        .catch((e: Error) => {
            loggerCreator.error('Server error on logout token: ', e);
            res.status(httpCodes.badRequest);
            res.send({ error: 'Error on logout.' });
        });
};
