import {Request, Response, NextFunction} from 'express';
import {CrudController} from '../crud-controller';
import User from "../../models/user/user-model";
import {generateUUID} from "../../utils/id-utils";
import {generateCurrentDateAtMs} from "../../utils/date-utils";
import {loggerCreator} from "../../services/logger/logger";
import httpCodes from "../../constants/http-codes";

export class UserController extends CrudController{
    create (req: {body: {username: string, password: string}}, res: Response, next: NextFunction): void {

        /* todo
            - check already login  check username and password conditions
            - check already exist
            - try save */

        /* By default all users will be create as GUEST permission, with new Date() as milliseconds */

        const requestBody : {username: string, password: string} = req.body;

        const {username, password }= requestBody

        /*
            Generate unique id.
            Generate date from new Date() at ms.
        */

        const newUser = new User({
            username, password, id: generateUUID(), date: generateCurrentDateAtMs()
        })

        newUser.save().then(resp=>{
            loggerCreator.info('Creation user success: ', resp.toString());
            res.status(httpCodes.successCreation);
            res.send({error: false});
        }).catch((/* err */)=>{
            /* const textOfUserCreationError : string = err.toString(); */
            /* loggerCreator.error('Creation user error: ', textOfUserCreationError); */
            res.send({error: true});
        })



    }

    read (req: Request, res: Response, next: NextFunction): void {
        throw new Error('Not implemented');
    }

    update (req: Request, res: Response, next: NextFunction): void {
        throw new Error('Not implemented');
    }

    delete (req: Request, res: Response, next: NextFunction): void {
        throw new Error('Not implemented');
    }


}
