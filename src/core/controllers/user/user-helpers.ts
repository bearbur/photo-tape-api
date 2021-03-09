import {Request, Response, NextFunction} from 'express';
import httpCodes from '../../constants/http-codes'
import jwt from 'jsonwebtoken';

export const userCheckLogin = (req: Request, res: Response, next: NextFunction) => {

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){

        res.status(httpCodes.noAuth);
        res.send({"error":"No auth header."});

        return;
    }

    /* todo - by token check access of user */

    /*tslint:disable*/
    console.log('token: ', token);
    /*tslint:enable*/
    next();
}



interface ReqObjectBody {
    username: string;
    password: string;
}

interface ReqObject {
    body: ReqObjectBody
}

export const userRegCheckBody = (req: ReqObject, res: Response, next: NextFunction) => {



    const reqObject : ReqObjectBody = req.body;
    const username : string =reqObject.username;
    const password : string = reqObject.password;

    if(!username || !password){
        res.status(httpCodes.badRequest);
        res.send({"error":"Please, send username and password at the request body."});

        return;
    }

    next();
}
