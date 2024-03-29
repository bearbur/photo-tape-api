import express from 'express';
import { authRegister, authReadProfile } from '../core/controllers/user/user-crud-midlewares';
import { userVerifyAuthToken } from '../core/controllers/user/user-verify-auth-token';
import {
    userRegister,
    userProfile,
    userLogin,
    userLogout,
    userChangePassword,
    userReAuth,
    freshArticles,
    newArticle,
} from '../core/constants/endpoints';
import {
    checkChangePasswordBody,
    checkLoginBodyHandler,
    userCheckAuthTokenBody,
    userRegistrationCheckBody,
} from '../core/controllers/user/user-body-check-handlers';
import { userVerifierOnLogin } from '../core/controllers/user/user-verifier-on-login';
import { userGenerateSignJwtToken } from '../core/controllers/user/user-generate-sign-jwt-token';
import { userLogoutAuthToken } from '../core/controllers/user/user-logout-auth-token';
import { userUpdatePassword } from '../core/controllers/user/user-update-password';
import { userReAuthByToken } from '../core/controllers/user/user-re-auth-by-token';
import { createPublicArticle, readLastPublicArticles } from '../core/controllers/article/article-crud-midlewares';

const router = express.Router();

/* Register user can only user with admin or moderator right - need check login, check role */
router.post(userRegister, [userRegistrationCheckBody, authRegister]);

/* Read users - need access */
router.get(userProfile, [userCheckAuthTokenBody, userVerifyAuthToken, authReadProfile]);

/*
    Login user - user must exist and have permissions for login.
    On success login - return auth token with expiration date.
    If user already login - return to him new token and remove exist token
*/

router.post(userLogin, [checkLoginBodyHandler, userVerifierOnLogin, userGenerateSignJwtToken]);

/*
    Logout user
    On success logout - remove auth token.
*/

router.post(userLogout, [userCheckAuthTokenBody, userVerifyAuthToken, userLogoutAuthToken]);

/*
    Update password for user
    On success password update - success response.
*/

/* todo reset other auth token for username, except current */

router.put(userChangePassword, [
    checkChangePasswordBody,
    userCheckAuthTokenBody,
    userVerifyAuthToken,
    userUpdatePassword,
]);

/*
    Get new auth token for user
    On success password generate new token for auth and make inactive current.
*/

router.get(userReAuth, [userCheckAuthTokenBody, userVerifyAuthToken, userReAuthByToken]);

/* Last public articles will be return (todo select from most popular and most fresh articles1)  */

router.get(freshArticles, [readLastPublicArticles]);

router.post(newArticle, [userCheckAuthTokenBody, userVerifyAuthToken, createPublicArticle]);

/* Public posts create - need access */

/* Private posts read - need access */

/* Private posts edit - need access */

export default router;
