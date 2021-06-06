import { NextFunction, Response } from 'express';
import { getJwtSignToken } from '../../utils/jwt-user-auth-utils';
import { getExpirationJWTms } from '../../../config/user-auth';
import AuthToken from '../../models/auth-token/auth-token-model';
import { loggerCreator } from '../../services/logger/logger';
import httpCodes from '../../constants/http-codes';

export const userGenerateSignJwtToken = (
    req: { body: { username: string; password: string } },
    res: Response,
    next: NextFunction
) => {
    const username = req.body.username;

    if (!username) {
        next();

        return;
    }

    const userNameToken = getJwtSignToken(username);

    const expirationDateMs = getExpirationJWTms();

    const newAuthToken = new AuthToken({ ['user_token']: userNameToken, ['expiration_date']: expirationDateMs });

    newAuthToken
        .save()
        .then(() => {
            loggerCreator.info(`New bearer token: ${userNameToken} for username ${username}.`);

            res.status(httpCodes.successCreation);
            res.send({ error: false, ['authToken']: userNameToken, expiration: expirationDateMs });
        })
        .catch((err) => {
            loggerCreator.error(`Error on generate sign in token for username ${username}. ${err}`);
            res.status(httpCodes.badRequest);
            res.send({ error: true, message: `Error on generate sign in token for username ${username}.` });
        });
};
