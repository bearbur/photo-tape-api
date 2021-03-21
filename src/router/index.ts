import express from "express";
import {authRegister, authReadProfile} from "./helpers/user-routes-helpers";
import {userCheckLogin, userRegCheckBody} from "../core/controllers/user/user-helpers";
import {userRegister, userProfile, userLogin} from "../core/constants/endpoints";

const router = express.Router();

/*Auth routes*/

router.get('/auth', (req,res,next) => {
    res.send('fake response');
});

/* Register user can only user with admin or moderator right - need check login, check role */
router.post(userRegister,[userRegCheckBody, authRegister]);

/* Read users - need access */
router.get(userProfile,[userCheckLogin, authReadProfile]);

/*
    Login user - user must exist and have permissions for login.
    On success login - return auth token with expiration date.
    If user already login - return to him new token and remove exist token
*/

router.post(userLogin,[])

/* Public posts read */

/* Public posts create - need access */

/* Private posts read - need access */

/* Private posts edit - need access */

export default router;
