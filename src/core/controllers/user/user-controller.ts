import {Request, Response, NextFunction} from 'express';
import {CrudController} from '../crud-controller';

export class UserController extends CrudController{
    create (req: Request, res: Response, next: NextFunction): void {



        /* todo check already login */

        /* todo check username and password conditions */

        /* todo check already exist */

        /*  todo try save */

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
