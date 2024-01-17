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
    is_Admin:z.string({
        required_error:'Admin user or not?',
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
    is_Admin:z.string({
        required_error:'Admin user or not?',
    }),
})

export const loginSchema = z.object({
    body: loginBodySchema,
})
