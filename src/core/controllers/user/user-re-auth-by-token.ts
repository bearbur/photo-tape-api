import { NextFunction, Response ,Request, ErrorRequestHandler} from "express";
import * as Async  from 'async';
import AuthToken from '../../models/auth-token/auth-token-model';
import { UserReauthInterface } from "../../interfaces/user-interfaces";
import { getJwtSignToken } from "../../utils/jwt-user-auth-utils";
import { getExpirationJWTms } from "../../../config/user-auth";
import { loggerCreator } from "../../services/logger/logger";
import httpCodes from "../../constants/http-codes";



export const userReAuthByToken = (req: {body:{username:string},headers: {authorization: string}} , res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    const {username } = req.body;

    Async.series(
        [
             (callback)=>{
                AuthToken.findOneAndUpdate(
                    {
                        user_token: token,
                    },
                    { inactive: true },
                    {
                        returnOriginal: false,
                    },((err:ErrorRequestHandler,docs:{})=>{
                        if(err){
                            throw new Error('Logout token error.');

                            return;
                        }
                        callback();
                    })
                )
             },
             (callback)=>{
                const userNameToken : string = getJwtSignToken(username);

                const expirationDateMs = getExpirationJWTms();
            
                const newAuthToken = new AuthToken({ ['user_token']: userNameToken, ['expiration_date']: expirationDateMs });

                newAuthToken
                .save()
                .then(() => {
                    loggerCreator.info(`New bearer token: ${userNameToken} for username ${username}.`);

                    res.status(httpCodes.successCreation);
                    res.send({ error: false, ['authToken']: userNameToken, expiration: expirationDateMs });

                    callback();

                })
                .catch((err:ErrorRequestHandler)=>{

                    throw new Error(`Error on generate sign in token for username ${username}. ${err}.`);

                })
        

             }
        ],(err:ErrorRequestHandler)=>{
            if(err){


                loggerCreator.error(`Error on re-auth. ${err}`);
                res.status(httpCodes.badRequest);
                res.send({ error: true, message: `Error on re-auth for username ${username}.` });

            }


        })



    
}