import prisma from '../util/prisma'
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { signupBodySchema } from '../validators/auth.validator'
import { z } from 'zod'
import Boom from '@hapi/boom'
import {
    createAccessToken,
    createRefreshToken,
    verifyRefreshToken,
} from '../util/token.util'

export const signup = async (user: z.infer<typeof signupBodySchema>) => {
    const { email, password, is_Admin } = user
    try {
        return await prisma.user.create({
            data: {
                email,
                password: await bcrypt.hash(password, 10),
                is_Admin,
            },
            select: {
                id: true,
                email: true,
                is_Admin:true,
            },
        })
    } catch (e: any) {
        if (
            e.code === 'P2002' &&
            e.meta?.target &&
            e.meta?.target[0] === 'email'
        ) {
            throw Boom.conflict('User with this email already exists')
        } else {
            throw e
        }
    }
}

export async function login(email: string, password: string, is_Admin:string) {
    const user = await prisma.user.findFirst({ where: { email } })
    if (!user) {
        throw Boom.badRequest('Username or password is incorrect.')
    } else {
        console.log(user.password)
    }
    console.log(user.password)

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        throw Boom.badRequest('Username or password is incorrect.')
    }

    const accessToken = createAccessToken(user.id, true)

    //accessToken = expires after certain period of time --- every request authentication 
        
    const refreshToken = createRefreshToken(user.id, true)
    //refreshToke = http only --- more secured

    return { accessToken, refreshToken }
}

export async function refresh(refreshToken: string) {
    try {
        const decodedToken: any = verifyRefreshToken(refreshToken)
        return createAccessToken(decodedToken.userId, decodedToken.isAdmin)
    } catch (error) {
        throw Boom.unauthorized('User is not logged in')
    }
}

export const getUser = async (id: any) => {
    try {
        return await prisma.user.findUniqueOrThrow({
            where: {
                id: Number(id),
            }, 
            select: {   //this is the output to the response secion
                id: true,   //these are the attributes that gets printed at the response
                email: true,
                is_Admin:true,
            },
        })
    } catch (err: any) {
        if (err.code === 'P2025') {
            throw Boom.notFound('User not found')   //this error is executed if the user is not found
        } else {
            throw err
        }
    }
}