import { Router } from 'express'
import { validateByBody, validateByid } from '../util/validate'
import {
    loginBodySchema,
    loginSchema,
    signupBodySchema,
    signupSchema,
} from '../validators/auth.validator'
import * as AuthController from '../controller/auth.controller'
import { authenticateToken, isAdmin } from '../middlewares/authentication.middleware'
import { getTodosByID } from '../controller/todo.controller'
import { getUserDTO } from '../validators/getUser.validator'

const router = Router()

//login user
router.post('/login', validateByBody(loginSchema), AuthController.loginUser)

//Register user
router.post(
    `/signup`,
    validateByBody(signupSchema),
    AuthController.registerUser
)

//Get by id
router.get(
    '/:id',
    authenticateToken,validateByid(getUserDTO),
    AuthController.getUserByID,
    (req, res) => {
        
    }
)

//Refresh access token
router.post('/refresh', AuthController.refreshToken)

//Logout user
router.post('/logout', () => {
    console.log(
        'this method should store any session info if stored, or remove cookie from the header'
    )
})

//Forgot password
router.post('/forgot-password', () => {
    console.log(
        'this method should send an email using sendgrid to the user with forgot password link'
    )
})

//Delete uesr
router.delete('/:id', authenticateToken, (req, res) => {
    res.send('Data deleted')
})

export default router

//how to add date in every request and response ??
