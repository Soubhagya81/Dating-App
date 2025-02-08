import { Router } from "express";
import {registerUser, loginUser, logoutUser} from '../controller/user.controller.js'
import  { verifyToken }  from "../middleware/auth.middleware.js";

const router = Router();

router.route('/registerUser').post(registerUser)

router.route('/login').post(loginUser)

router.route('/logout').post(verifyToken, logoutUser)


export default router