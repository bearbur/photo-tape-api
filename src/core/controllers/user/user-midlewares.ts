import { NextFunction, Request, Response } from 'express';
import httpCodes from '../../constants/http-codes';
import AuthToken from '../../models/auth-token/auth-token-model';
import User from '../../models/user/user-model';
import { loggerCreator } from '../../services/logger/logger';
import { checkOnEmptyArray } from '../../utils/data-analayze-utils';
import { checkOnExpirationDate, generateCurrentDateAtMs } from '../../utils/date-utils';
import { FIRST_ELEMENT_INDEX } from '../../constants/utils-constants';
import { AuthTokenFindResult, AuthTokenFindResultUnit } from '../../interfaces/aut-token-interfaces';
import { generateHashPassword } from '../../utils/hash-passwords-utils';
import { getJwtSignToken } from '../../utils/jwt-user-auth-utils';
import { getExpirationJWTms } from '../../../config/user-auth';
import { Error } from 'mongoose';

export const userCheckAuthToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    loggerCreator.info('token:', token);

    AuthToken.find(
        {
            user_token: token,
            inactive: false,
        },
        (err, data: AuthTokenFindResult) => {
            if (err) {
                loggerCreator.error('Server error on find token.');
                res.status(httpCodes.badRequest);
                res.send({ error: 'Error on find token.' });

                return;
            }

            if (checkOnEmptyArray(data)) {
                loggerCreator.error('Not found token at DB.');
                res.status(httpCodes.noAuth);
                res.send({ error: 'Not found token at DB.' });

                return;
            }

            const { expiration_date, user_token, inactive } = data[FIRST_ELEMENT_INDEX];

            loggerCreator.info(expiration_date);
            loggerCreator.info(user_token);
            loggerCreator.info(inactive);

            if (!expiration_date || !user_token || typeof inactive !== 'boolean') {
                loggerCreator.error(
                    `Wrong data at DB. Need contain expiration_date, user_token, inactive fields at model.`
                );
                res.status(httpCodes.badRequest);
                res.send({
                    error: 'Error with your token.',
                });

                return;
            }

            /* todo - by token check access of user */

            /* check on expiration time - call checkOnExpirationDateMinutes with expiration_date field */

            if (!checkOnExpirationDate(expiration_date)) {
                loggerCreator.error(`Expire token. ${expiration_date} - expiration_date.`);
                res.status(httpCodes.noAuth);
                res.send({
                    error: 'Token has expire.',
                });

                return;
            }

            loggerCreator.info(`User token: ${user_token}  was successfully login.`);

            next();
        }
    );
};

export const userVerifierOnLogin = (
    req: { body: { username: string; password: string } },
    res: Response,
    next: NextFunction
) => {
    const { username, password } = req.body;
    generateHashPassword(password)
        .then((hashedPassword) => {
            User.find({ ['username']: username, ['password']: hashedPassword }, (err: Error, response) => {
                const zeroLengthResponse = 0;
                if (err) {
                    const minLengthLog = 0;
                    const maxLengthLog = 100;
                    const errorMessage = `Error on find user with username ${username}. Stacktrace: ${err
                        .toString()
                        .slice(minLengthLog, maxLengthLog)} at ${generateCurrentDateAtMs()}.`;
                    loggerCreator.error(errorMessage);
                    res.status(httpCodes.noAuth);
                    res.send({ error: true, message: errorMessage });

                    return;
                }
                if (!response || response.length === zeroLengthResponse) {
                    const warnMessage = `Not find user with username (${username}) and password at ${generateCurrentDateAtMs()}.`;
                    loggerCreator.warn(warnMessage);
                    res.status(httpCodes.notFound);
                    res.send({ error: false, message: warnMessage });

                    return;
                }

                next();
            });
        })
        .catch(() => {
            const errorMessage = `Hash password error: at ${generateCurrentDateAtMs()}.`;
            loggerCreator.error(errorMessage);
            res.status(httpCodes.conflictAtRequest);
            res.send({ error: true, message: errorMessage });
        });
};

export const generateSignJwtToken = (
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
            res.send({ error: false, ['authToken']: userNameToken });
        })
        .catch((err) => {
            loggerCreator.error(`Error on generate sign in token for username ${username}. ${err}`);
            res.status(httpCodes.serverError);
            res.send({ error: true, message: `Error on generate sign in token for username ${username}.` });
        });
};

export const logoutUserAuthToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    /* tslint:disable */
    AuthToken.findOneAndUpdate(
        /* tslint:enable */
        {
            user_token: token,
        },
        { inactive: true },
        { new: true }
    )
        .then((resp: AuthTokenFindResultUnit) => {
            loggerCreator.info('Logout token success.', token);
            res.status(httpCodes.success);
            res.send({ error: false, message: `Successfully logout.` });
        })
        .catch((e: Error) => {
            loggerCreator.error('Server error on logout token.');
            res.status(httpCodes.badRequest);
            res.send({ error: 'Error on logout.' });
        });
};
