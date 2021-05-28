import { NextFunction, Request, Response } from 'express';
import httpCodes from '../../constants/http-codes';
import AuthToken from '../../models/auth-token/auth-token-model';
import { loggerCreator } from '../../services/logger/logger';
import { checkOnEmptyArray } from '../../utils/data-analayze-utils';
import { checkOnExpirationDate } from '../../utils/date-utils';
import { FIRST_ELEMENT_INDEX } from '../../constants/utils-constants';
import { AuthTokenFindResult } from '../../interfaces/aut-token-interfaces';

export const userVerifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
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
