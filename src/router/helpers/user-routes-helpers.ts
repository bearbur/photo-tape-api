import { UserController } from '../../core/controllers/user/user-controller';
import { Request, Response, NextFunction } from 'express';

export const authRegister = (req: Request, res: Response, next: NextFunction) => {
    const userController = new UserController();
    userController.create(req, res, next);
};

export const authReadProfile = (req: Request, res: Response, next: NextFunction) => {
    const userController = new UserController();
    userController.read(req, res, next);
};

