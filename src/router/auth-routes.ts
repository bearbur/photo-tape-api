import {UserController} from "../core/controllers/user/user-controller";


export const authRegister = (req: any, res: any, next: any) => {

    // todo login and password check from db and for correct conditions

    const userController = new UserController();

    userController.create(req, res, next);


}
