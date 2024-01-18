import prisma from '../util/prisma'
import * as jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { loginBodySchema, signupBodySchema } from '../validators/auth.validator'
import { number, string, z } from 'zod'
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
                is_Admin
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

export async function login(email: string, password: string) {    //why not passing is_Admin
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

    const accessToken = createAccessToken(user.id, user.is_Admin)

    //accessToken = expires after certain period of time --- every request authentication 
        
    const refreshToken = createRefreshToken(user.id, user.is_Admin)
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

//DELETE user 
export async function deleteUser(data:z.infer<typeof loginBodySchema>){
    const {email, password} = data
    try{
    const user = await prisma.user.findFirstOrThrow({ where: { email:email } })
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

    return await prisma.user.delete({
    where:{
            email: email,
        }})

}catch(err)
{
   throw err
}}