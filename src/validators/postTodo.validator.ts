import { z } from 'zod'

export const postTodoValidatorDTO = z.object({
    body: z.object({
        title: z.string({
            required_error: 'TItle is required',
        }),
        status: z.string({
            required_error: 'Status is required',
        }),
    }),
})
