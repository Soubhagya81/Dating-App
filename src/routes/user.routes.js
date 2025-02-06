import { Router } from "express";
import {registerUser} from '../controller/user.controller.js'

const router = Router();

router.route('/registerUser').post(registerUser)


export default router