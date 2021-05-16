import bcrypt from 'bcrypt';
import { SALT_FACTOR_USER_MODEL } from '../constants/salt';
import * as fs from 'fs';
import * as path from 'path';
import { Error } from 'mongoose';
import { loggerCreator } from '../services/logger/logger';

const ZERO_FILE_DATA_LENGTH = 0;

/* save salt at file and read from it*/

const takeSalt = (): Promise<string> => {
    return new Promise((resolve, reject) => {
        const filenameSalt = path.resolve(__dirname, '../../../', 'private', 'salt.txt');

        fs.access(filenameSalt, fs.constants.W_OK, (error: Error) => {
            const saltToClient = bcrypt.genSaltSync(SALT_FACTOR_USER_MODEL);

            if (!error) {
                fs.readFile(filenameSalt, 'utf8', (err: Error, fileData) => {
                    if (err) {
                        loggerCreator.error(`Error on read file: ${error}.`);
                        reject(err);
                    }
                    if (!fileData || fileData.length === ZERO_FILE_DATA_LENGTH) {
                        fs.writeFile(filenameSalt, saltToClient, (errWrite: Error) => {
                            if (errWrite) {
                                loggerCreator.error(`Error on write file: ${errWrite}.`);
                                reject(errWrite);
                            }

                            resolve(saltToClient);
                        });
                    } else {
                        resolve(fileData);
                    }
                });
            } else {
                loggerCreator.error(`Error on file access: ${error}.`);

                fs.appendFile(filenameSalt, saltToClient, { encoding: 'utf8', flag: 'a' }, (err) => {
                    if (err) {
                        loggerCreator.error(`Error on file append file: ${error}.`);
                        reject(err);
                    } else {
                        resolve(saltToClient);
                    }
                });
            }
        });
    });
};

export const generateHashPassword = (plaintextPassword: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        takeSalt()
            .then((resp) => {
                /*tslint:disable*/
                resolve(bcrypt.hashSync(plaintextPassword, resp));
                /*tslint:enable*/
            })
            .catch((err) => {
                loggerCreator.error(`Error on takeSalt: ${err}.`);
                reject(err);
            });
    });
};
