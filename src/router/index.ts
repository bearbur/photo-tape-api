import express from "express";
import {authRegister} from "./auth-routes";

const router = express.Router();

/*Auth routes*/

router.get('/auth', (req,res,next)=>{
    res.send('fake response');
})

router.post('/auth/register',authRegister)

export default router;
