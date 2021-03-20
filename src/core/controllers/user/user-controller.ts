import {Request, Response, NextFunction} from 'express';
import {CrudController} from '../crud-controller';

export class UserController extends CrudController{
    create (req: Request, res: Response, next: NextFunction): void {

        /* todo
            - check already login  check username and password conditions
            - check already exist
            - try save */

        res.send({error: true});

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
