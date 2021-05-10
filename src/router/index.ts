import express from "express";
import {authRegister, authReadProfile} from "./helpers/user-routes-helpers";
import {
    generateSignJwtToken, userCheckLogin,
    userVerifierOnLogin,
} from '../core/controllers/user/user-midlewares'
import {userRegister, userProfile, userLogin, userLogout} from "../core/constants/endpoints";
import {
    checkLoginBodyHandler,
    userCheckAuthTokenBody,
    userRegistrationCheckBody,
} from '../core/controllers/user/user-body-check-handlers'

const router = express.Router();


/* Register user can only user with admin or moderator right - need check login, check role */
router.post(userRegister,[userRegistrationCheckBody, authRegister]);

/* Read users - need access */
router.get(userProfile,[userCheckAuthTokenBody, userCheckLogin, authReadProfile]);

/*
    Login user - user must exist and have permissions for login.
    On success login - return auth token with expiration date.
    If user already login - return to him new token and remove exist token
*/

router.post(userLogin,[checkLoginBodyHandler, userVerifierOnLogin, generateSignJwtToken])

/*
    Logout user
    On success logout - remove auth token.
*/

router.post(userLogout,[])

/* Public posts read */

/* Public posts create - need access */

/* Private posts read - need access */

/* Private posts edit - need access */

export default router;
