import { Request, Response, NextFunction } from 'express';
import { CrudController } from '../crud-controller';
import User from '../../models/user/user-model';
import { generateCurrentDateAtMs } from '../../utils/date-utils';
import { loggerCreator } from '../../services/logger/logger';
import httpCodes from '../../constants/http-codes';
import { generateHashPassword } from '../../utils/hash-passwords-utils';
import { Error } from 'mongoose';
import { UserRegReqObject } from '../../interfaces/user-interfaces';

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
        throw new Error('Not implemented');
    }

    update(req: Request, res: Response, next: NextFunction): void {
        throw new Error('Not implemented');
    }

    delete(req: Request, res: Response, next: NextFunction): void {
        throw new Error('Not implemented');
    }
}
