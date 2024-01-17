import express, { NextFunction, Request, Response } from 'express'
import buildError from './util/build-errors'
import authRouter from './routes/auth.route'
import todoRouter from './routes/todo.router'
import { authenticateToken } from './middlewares/authentication.middleware'
const app = express()

app.use(express.json())

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server ready at : localhost:${PORT}`)
})

app.use('/api/todos', todoRouter)
app.use('/api/auth', authRouter)

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const error = buildError(err)
    res.status(error.code).json({ error })
})

export default app
