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
