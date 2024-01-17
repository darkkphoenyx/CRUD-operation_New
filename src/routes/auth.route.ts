import { Router } from 'express'
import { validateByBody } from '../util/validate'
import {
    loginBodySchema,
    loginSchema,
    signupBodySchema,
    signupSchema,
} from '../validators/auth.validator'
import * as AuthController from '../controller/auth.controller'
import { authenticateToken } from '../middlewares/authentication.middleware'

const router = Router()

router.post('/login', validateByBody(loginSchema), AuthController.loginUser)

router.post(
    `/signup`,
    validateByBody(signupSchema),
    AuthController.registerUser
)

router.post('/refresh', AuthController.refreshToken)

router.post('/logout', () => {
    console.log(
        'this method should store any session info if stored, or remove cookie from the header'
    )
})

router.post('/forgot-password', () => {
    console.log(
        'this method should send an email using sendgrid to the user with forgot password link'
    )
})

router.get('/', authenticateToken, (req,res)=>{
    res.send('hello');
})
export default router

//how to add date in every request and response ??
