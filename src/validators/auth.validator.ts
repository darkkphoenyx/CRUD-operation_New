import { z } from 'zod'

//SignIn
export const signupBodySchema = z.object({
    email: z
        .string({
            required_error: 'Email is required',
        })
        .email('Email address is invalid'),
    password: z.string({
        required_error: 'Password is required',
    }),
    is_Admin:z.boolean({
        required_error:'is_Admin:(true/false) - Boolean also required',
    }),
})

export const signupSchema = z.object({
    body: signupBodySchema,
})

//LogIn
export const loginBodySchema = z.object({
    email: z.string({
        required_error: 'Email is required',
    })
    .email('Email address is invalid'),
    password: z.string({
        required_error: 'Password is required',
    }),
    is_Admin:z.boolean({
        required_error:'is_Admin:(true/false) - Boolean also required',
    }),
})

export const loginSchema = z.object({
    body: loginBodySchema,
})
