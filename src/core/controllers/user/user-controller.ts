import { Request, Response, NextFunction } from 'express';
import { CrudController } from '../crud-controller';
import User from '../../models/user/user-model';
import { generateCurrentDateAtMs } from '../../utils/date-utils';
import { loggerCreator } from '../../services/logger/logger';
import httpCodes from '../../constants/http-codes';
import { generateHashPassword } from '../../utils/hash-passwords-utils';
import { Error } from 'mongoose';
import { UserRegReqObject } from '../../interfaces/user-interfaces';
import { decodeJWTToken } from '../../utils/jwt-user-auth-utils';
import { ARRAY_ZERO_LENGTH } from '../../constants/utils-constants';

export class UserController extends CrudController {
    create(req: UserRegReqObject, res: Response, next: NextFunction): void {
        /* By default all users will be create as GUEST permission, with new Date() as milliseconds */
        const requestBody: { username: string; password: string } = req.body;
        const { username, password } = requestBody;

        generateHashPassword(password)
            .then((hashedPass) => {
                const newUser = new User({
                    username,
                    password: hashedPass,
                });

                newUser
                    .save()
                    .then(() => {
                        const messageToLog = `Creation user success: ${username} was created at ${generateCurrentDateAtMs()}.`;
                        loggerCreator.info(messageToLog);
                        res.status(httpCodes.successCreation);
                        res.send({ error: false, message: messageToLog });
                    })
                    .catch((err: Error) => {
                        const minLengthLog = 0;
                        const maxLengthLog = 100;
                        const errorMessage = `Creation user error: ${err
                            .toString()
                            .slice(minLengthLog, maxLengthLog)} at ${generateCurrentDateAtMs()}.`;
                        loggerCreator.error(errorMessage);
                        res.status(httpCodes.conflictAtRequest);
                        res.send({ error: true, message: `Creation user error at ${generateCurrentDateAtMs()}.` });
                    });
            })
            .catch(() => {
                const errorMessage = `Hash password error at ${generateCurrentDateAtMs()}.`;
                loggerCreator.error(errorMessage);
                res.status(httpCodes.conflictAtRequest);
                res.send({ error: true, message: errorMessage });
            });
    }

    read(req: Request, res: Response, next: NextFunction): void {
        /* get username from auth header on jwt decode */

        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        decodeJWTToken(token)
            .then((response: { data: string } | undefined) => {
                if (!response || !response.data) {
                    loggerCreator.error(`Error on jwt decode with key: ${response.data}`);
                    res.status(httpCodes.badRequest);
                    res.send({
                        error: true,
                        message: 'Error on request.',
                    });

                    return;
                }

                const username = response.data;

                /* find user profile */

                User.find(
                    { ['username']: username, is_active: true },
                    (err, respUserData: { username: string; id: string; creation_date: number }[] | []) => {
                        if (err) {
                            loggerCreator.error(`Error on find profile: ${err}`);
                            res.status(httpCodes.badRequest);
                            res.send({
                                error: true,
                                message: 'Error on find profile.',
                            });

                            return;
                        }

                        if (respUserData.length === ARRAY_ZERO_LENGTH) {
                            loggerCreator.error(`Not found such user`);
                            res.status(httpCodes.notFound);
                            res.send({
                                error: true,
                                message: 'Not found.',
                            });

                            return;
                        }

                        const firstUser = respUserData[ARRAY_ZERO_LENGTH];

                        res.status(httpCodes.success);
                        res.send({
                            error: false,
                            message: `Profile was read successfully.`,
                            data: {
                                username: firstUser.username,
                                id: firstUser.id,
                                creation_date: firstUser.creation_date,
                            },
                        });

                        return;
                    }
                );
            })
            .catch((e) => {
                loggerCreator.error(`Error on decode: ${e}`);
                res.status(httpCodes.badRequest);
                res.send({
                    error: true,
                    message: 'Error on request for decode data.',
                });
            });
    }

    update(req: Request, res: Response, next: NextFunction): void {
        throw new Error('Not implemented');
    }

    delete(req: Request, res: Response, next: NextFunction): void {
        throw new Error('Not implemented');
    }
}
