import { Router } from "express";
import * as AuthController from '../controller/auth.controller'

const router = Router()

//register user
router.post('/registerUser', AuthController.registerUser)

export default router