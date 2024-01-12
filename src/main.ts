import express, { NextFunction, Request, Response } from 'express'
import todoRouter from './routes/todo.router'
const app = express()

app.use(express.json())

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server ready at : localhost:${PORT}`)
})

app.use('/todos', todoRouter)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err.isBoom) {
        const error = {
            code: err.output.statusCode,
            message: err.output.payload.message || err.output.payload.status,
        }
        res.status(error.code).json({ error })
    }
})

export default app
