import { NextFunction, Request, Response } from 'express'
import { loginBodySchema, signupBodySchema } from '../validators/auth.validator'
import * as AuthService from '../service/auth.service'
import { string } from 'zod'

//Register new user
export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const createdUser = await AuthService.signup(
            signupBodySchema.parse(req.body)
        )
        res.status(201).json(createdUser)
    } catch (err) {
        next(err)
    }
}

//Login user
export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password, is_Admin} = loginBodySchema.parse(req.body)

        const { accessToken, refreshToken } = await AuthService.login(
            email,
            password,
            is_Admin
        )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/api/auth/refresh',
        }).json({ accessToken })
    } catch (error) {
        next(error)
    }
}


//Delete user
export const deleteUser=async(req:Request, res: Response, next: NextFunction)=>{

}

//Refresh access token
export const refreshToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { refreshToken } = req.cookies
    try {
        const token = await AuthService.refresh(refreshToken)
        res.json({ accessToken: token })
    } catch (error) {
        next(error)
    }
}

//Get by id
export const getUserByID = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const response = await AuthService.getUser(req.params.id)
        res.json(response)
    } catch (err) {
        next(err)
    }
}

