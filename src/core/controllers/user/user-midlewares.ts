import {NextFunction, Request, Response} from 'express';
import httpCodes from '../../constants/http-codes'
import {UserRegReqObject, UserRegReqObjectBody} from "../../interfaces/user-interfaces";
import AuthToken from '../../models/auth-token/auth-token-model';
import {loggerCreator} from "../../services/logger/logger";
import {checkOnEmptyArray} from "../../utils/data-analayze-utils";
import {checkOnExpirationDate, generateCurrentDateAtMs} from "../../utils/date-utils";
import {FIRST_ELEMENT_INDEX} from "../../constants/utils-constants";
import {AuthTokenFindResultUnit} from "../../interfaces/aut-token-interfaces";
import {MIN_PASSWORD_LENGTH, MIN_USERNAME_LENGTH} from "../../constants/user-conditions-constants";
import User from "../../models/user/user-model";
import {generateHashPassword} from "../../utils/hash-passwords-utils";
import {getJwtSignToken} from "../../utils/jwt-user-auth-utils";

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


    if(!token || !authHeader){

        res.status(httpCodes.noAuth);
        res.send({"error":"No auth header."});

    }

    return token
}

/*Will be check precondition for login endpoint*/
export const checkLoginBodyHandler  = (req: { body: { username: string ,password: string } }, res: Response, next: NextFunction) => {

    const missParametersHandler = (warningParameters: string) : void => {
        res.status(httpCodes.badRequest);
        res.send({"error": `Need for login: ${warningParameters}.`})

        return;
    }

    const reqBody  = req.body;
    if(!reqBody){
        missParametersHandler('body object');
    }

    const {username, password} = reqBody;

    if(!username){
        missParametersHandler('user username at body object');
    }

    if(!password){
        missParametersHandler('user password at body object');
    }


    next()
}

export const userVerifierOnLogin =  (req: {body: {username: string, password: string}}, res: Response, next: NextFunction) => {

    const {username, password} = req.body;

    User.find({username, password: generateHashPassword(password)}, (err: Error, response)=>{
        if(err){
            const minLengthLog = 0;
            const maxLengthLog = 100;
            const errorMessage = `Not find user with username ${username}. Stacktrace: ${err.toString().slice(minLengthLog,maxLengthLog)} at ${generateCurrentDateAtMs()}.`;
            loggerCreator.error(errorMessage);
            res.status(httpCodes.noAuth);
            res.send({error: true, message: errorMessage});
        }
        next();
    })

}

export const generateSignJwtToken =  (req: {body: {username: string, password: string}}, res: Response, next: NextFunction) => {
    const username = req.body.username;



    const userNameToken = getJwtSignToken(username);

    /*Todo find id by username and check conditions for this user*/

    /*Todo count all valid by time and id auth token*/

    /*Todo - if count + 1 less than MAX - save new token at db width id as user_id and expiration date*/

    /*Todo - if count + 1 more than MAX -   save new token at db width id as user_id and expiration date*/

    /*Todo update earliest auth token 'deleted' to true*/

    loggerCreator.info(`New bearer token: ${userNameToken} for username ${username}.`);

    res.status(httpCodes.serverError);
    res.send({error: true})
}
