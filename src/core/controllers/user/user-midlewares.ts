import { NextFunction, Request, Response } from 'express';
import httpCodes from '../../constants/http-codes';
import AuthToken from '../../models/auth-token/auth-token-model';
import User from '../../models/user/user-model';
import { loggerCreator } from '../../services/logger/logger';
import { checkOnEmptyArray } from '../../utils/data-analayze-utils';
import { checkOnExpirationDate, generateCurrentDateAtMs } from '../../utils/date-utils';
import { FIRST_ELEMENT_INDEX } from '../../constants/utils-constants';
import { AuthTokenFindResultUnit } from '../../interfaces/aut-token-interfaces';
import { generateHashPassword } from '../../utils/hash-passwords-utils';
import { getJwtSignToken } from '../../utils/jwt-user-auth-utils';
import { getExpirationJWTms } from '../../../config/user-auth';

export const userCheckLogin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    /* todo - by token check access of user */

    AuthToken.find(
        {
            token,
        },
        (err, data: AuthTokenFindResultUnit[]) => {
            if (err) {
                loggerCreator.error('Server error on find token.');
                res.status(httpCodes.serverError);
                res.send({ error: 'Server error on find token.' });

                return;
            }

            if (checkOnEmptyArray(data)) {
                loggerCreator.error('Not found token at DB.');
                res.status(httpCodes.serverError);
                res.send({ error: 'Not found token at DB.' });

                return;
            }

            const { expiration_date, user_token, user_id } = data[FIRST_ELEMENT_INDEX];

            if (!expiration_date || !user_token || !user_id) {
                loggerCreator.error(
                    `Wrong data at DB. Need contain expiration_date, user_token, user_id fields at model.`
                );
                res.status(httpCodes.serverError);
                res.send({
                    error: 'Wrong data at DB. Need contain expiration_date, user_token, user_id fields at model.',
                });

                return;
            }

            /* todo check on expiration time - call checkOnExpirationDateMinutes with expiration_date field */

            checkOnExpirationDate(expiration_date);
            loggerCreator.info('User token: ', token, ' was successfully login.');

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
