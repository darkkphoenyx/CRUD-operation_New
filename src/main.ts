import express, { NextFunction, Request, Response } from 'express'
import buildError from './util/build-errors'
import userRouter from './routes/auth.route'
import todoRouter from './routes/todo.router'
const app = express()

app.use(express.json())

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server ready at : localhost:${PORT}`)
})

app.use('/todos', todoRouter)
app.use('/users', userRouter)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const error = buildError(err)
    res.status(error.code).json({ error })
})



export default app
