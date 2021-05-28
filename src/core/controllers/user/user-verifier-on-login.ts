import { NextFunction, Response } from 'express';
import { generateHashPassword } from '../../utils/hash-passwords-utils';
import User from '../../models/user/user-model';
import { Error } from 'mongoose';
import { generateCurrentDateAtMs } from '../../utils/date-utils';
import { loggerCreator } from '../../services/logger/logger';
import httpCodes from '../../constants/http-codes';

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
