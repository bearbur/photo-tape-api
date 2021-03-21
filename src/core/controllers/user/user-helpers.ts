import {NextFunction, Request, Response} from 'express';
import httpCodes from '../../constants/http-codes'
import {UserRegReqObject, UserRegReqObjectBody} from "../../interfaces/user-interfaces";
import AuthToken from '../../models/auth-token/auth-token-model';
import {loggerCreator} from "../../services/logger/logger";
import {checkOnEmptyArray} from "../../utils/data-analayze-utils";
import {checkOnExpirationDate} from "../../utils/date-utils";
import {FIRST_ELEMENT_INDEX} from "../../constants/utils-constants";
import {AuthTokenFindResultUnit} from "../../interfaces/aut-token-interfaces";
import {MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH} from "../../constants/user-conditions-constants";

export const userCheckLogin = (req: Request, res: Response, next: NextFunction) => {

    const token = userCheckAuthTokenBody(req, res, next);

    if(!token){
        return;
    }

    /* todo - by token check access of user */

    AuthToken.find({
        token
    }, (err, data: AuthTokenFindResultUnit[])=>{
        if(err){
            loggerCreator.error("Server error on find token.")
            res.status(httpCodes.serverError);
            res.send({"error":"Server error on find token."});

            return;
        }


        if(checkOnEmptyArray(data)){
            loggerCreator.error('Not found token at DB.')
            res.status(httpCodes.serverError);
            res.send({"error":"Not found token at DB."});

            return;
        }

        const {expiration_date, user_token, user_id} = data[FIRST_ELEMENT_INDEX];

        if(!expiration_date ||
            !user_token ||
            !user_id
        ){
            loggerCreator.error(`Wrong data at DB. Need contain expiration_date, user_token, user_id fields at model.`)
            res.status(httpCodes.serverError);
            res.send({"error":"Wrong data at DB. Need contain expiration_date, user_token, user_id fields at model."});

            return;
        }

        /* todo check on expiration time - call checkOnExpirationDateMinutes with expiration_date field */

        checkOnExpirationDate(expiration_date)

        /*tslint:disable*/
        loggerCreator.info('User token: ', token, ' was successfully login.');
        console.log('data: ', data);
        /*tslint:enable*/
        next();
    })


}

export const userRegCheckBody = (req: UserRegReqObject, res: Response, next: NextFunction) => {

    const reqObject : UserRegReqObjectBody = req.body;
    const username : string = reqObject.username;
    const password : string = reqObject.password;

    /* Check login and password for minimum correct conditions (exist and not less than minimum conditions */
    if(!username || !password){
        res.status(httpCodes.badRequest);
        res.send({"error":"Please, send username and password at the request body."});

        return;
    }

    if(username.length <= MIN_USERNAME_LENGTH || password.length <= MIN_PASSWORD_LENGTH){
        res.status(httpCodes.badRequest);
        res.send({"error": `Minimum length of username is ${MIN_USERNAME_LENGTH} symbols. Minimum length of username is ${MIN_PASSWORD_LENGTH} symbols.`});

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
