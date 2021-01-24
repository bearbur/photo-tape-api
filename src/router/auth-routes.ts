import {UserController} from "../core/controllers/user/user-controller";
import {Request, Response, NextFunction} from 'express';

export const authRegister = (req: Request, res: Response, next: NextFunction) => {

    /* todo login and password check from db and for correct conditions */

    const userController = new UserController();

    userController.create(req, res, next);


};
