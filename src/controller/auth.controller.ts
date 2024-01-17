import { NextFunction, Request, Response } from 'express'
import { loginBodySchema, signupBodySchema } from '../validators/auth.validator'
import * as AuthService from '../service/auth.service'

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

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = loginBodySchema.parse(req.body)

        const { accessToken, refreshToken } = await AuthService.login(
            email,
            password
        )
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            path: '/api/auth/refresh',
        }).json({ accessToken })
    } catch (error) {
        next(error)
    }
}

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

