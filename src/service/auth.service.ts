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
    const { email, password } = user
    try {
        return await prisma.user.create({
            data: {
                email,
                password: await bcrypt.hash(password, 10),
            },
            select: {
                email: true,
                id: true,
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

export async function login(email: string, password: string) {
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
    //refreshToke = http only --- more secured

    const refreshToken = createRefreshToken(user.id, true)

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
