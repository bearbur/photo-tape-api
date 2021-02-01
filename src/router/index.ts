import express from "express";
import {authRegister} from "./auth-routes";
import {userCheckLogin} from "../core/controllers/user/user-helpers";

const router = express.Router();

/*Auth routes*/

router.get('/auth', (req,res,next) => {
    res.send('fake response');
});

/* Register user can only user with admin or moderator right - need check login, check role */
router.post('/auth/register',[userCheckLogin, authRegister]);

/* Read users - need access */

/* Public posts read */

/* Public posts create - need access */

/* Private posts read - need access */

/* Private posts edit - need access */

export default router;
