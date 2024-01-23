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


//signup
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

//login
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

    const accessToken = createAccessToken(user.id, user.email, user.is_Admin)

    //accessToken = expires after certain period of time --- every request authentication 
        
    const refreshToken = createRefreshToken(user.id, user.email, user.is_Admin)
    //refreshToke = http only --- more secured

    return { accessToken, refreshToken }
}

export async function refresh(refreshToken: string) {
    try {
        const decodedToken: any = verifyRefreshToken(refreshToken)
        return createAccessToken(decodedToken.userId, decodedToken.username, decodedToken.isAdmin)
    } catch (error) {
        throw Boom.unauthorized('User is not logged in')
    }
}


//there is a little bug in delete method
/*
condition:
A                                                     B
username: hero@gmail.com                        username: heroine@gmail.com
password: 123                                   password: 123

even though the username are different but if their password is same then, if user B wants to delete his account 
then he generated his accessToken, then he also gains the right to delete user A's account
this is because their password is same, doesn't matter if their username is different

.. this may be due to issue in token generation and token comparision

*/
//DELETE user 
export async function deleteUser(data:z.infer<typeof loginBodySchema>){
    const {email, password} = data
    try{
    const user = await prisma.user.findFirst({ where: { email:email } })
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