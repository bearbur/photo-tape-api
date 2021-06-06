import { NextFunction, Response } from 'express';
import * as Async  from 'async';
import User from '../../models/user/user-model'
import { loggerCreator } from '../../services/logger/logger';
import httpCodes from '../../constants/http-codes';
import { Error } from 'mongoose';
import { UserRegReqObject, UserRegReqObjectBody, UserInterface } from '../../interfaces/user-interfaces';
import { generateHashPassword } from '../../utils/hash-passwords-utils';


export const userUpdatePassword = (req: UserRegReqObject, res: Response, next: NextFunction) => {
    
    const reqObject: UserRegReqObjectBody = req.body;
    const username: string = reqObject.username;
    const password: string = reqObject.password;

    let hashedPassword : string = '';
    let updatedUserPasswordStatus : boolean = false;

    Async.series(
        [
             (callback)=>{
              generateHashPassword(password).then((hashed:string)=>{
                hashedPassword = hashed;
                callback();

              }).catch((err:Error)=>{
                throw new Error('Hashed error!');
              })
                
            },
            (callback)=>{
                 User.updateOne({username}, {password: hashedPassword},{},(err:Error,doc: {})=>{
                     if(err){
                        throw new Error('User update one error!');
                     }
                     updatedUserPasswordStatus = true;
                     callback();
                 });
            },
            ()=>{


                if(!updatedUserPasswordStatus){
                    res.status(httpCodes.badRequest);

                     res.send({error: true, message: 'User was not update.'})

                     return;
                }
                loggerCreator.info(`Success update password for ${username}.`);
                res.status(httpCodes.success);

                res.send({error: false, message:'Password was update.'});

            }

            /* todo - on update password - reset all auth token for this user */

        ],
        (error:Error)=>{
            if(error){
                loggerCreator.error('Error on update password. ',error);
                res.status(httpCodes.badRequest);
                res.send({error: true, message: 'Error on update password.'})

                return;
            }
            next()
        }
    );


};
