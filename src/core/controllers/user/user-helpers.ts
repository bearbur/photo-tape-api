import {NextFunction, Request, Response} from 'express';
import httpCodes from '../../constants/http-codes'
import {UserRegReqObject, UserRegReqObjectBody} from "../../interfaces/user-interfaces";
import AuthToken from '../../models/auth-token/auth-token-model';
import {loggerCreator} from "../../services/logger/logger";
import {checkOnEmptyArray} from "../../utils/data-analayze-utils";

export const userCheckLogin = (req: Request, res: Response, next: NextFunction) => {

    const token = userCheckAuthTokenBody(req, res, next);

    if(!token){
        return;
    }

    /* todo - by token check access of user */

    AuthToken.find({
        token
    }, (err, data)=>{
        if(err){
            loggerCreator.error("Server error on find token.")
            res.status(httpCodes.serverError);
            res.send({"error":"Server error on find token."});

            return;
        }


        if(checkOnEmptyArray(data)){
            loggerCreator.error('Not found token at DB.')
            res.status(httpCodes.serverError);
            res.send({"error":"Server error on find token."});

            return;
        }

        /*tslint:disable*/
        console.log('token: ', token);
        console.log('data: ', data);
        /*tslint:enable*/
        next();
    })


}

export const userRegCheckBody = (req: UserRegReqObject, res: Response, next: NextFunction) => {

    const reqObject : UserRegReqObjectBody = req.body;
    const username : string =reqObject.username;
    const password : string = reqObject.password;

    if(!username || !password){
        res.status(httpCodes.badRequest);
        res.send({"error":"Please, send username and password at the request body."});

        return;
    }

    next();
}

export const userCheckAuthTokenBody = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){

        res.status(httpCodes.noAuth);
        res.send({"error":"No auth header."});

        return;
    }

    return token
}
