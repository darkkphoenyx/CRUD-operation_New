import express from 'express'
import todoRouter from './routes/todo.router'
const app = express()

app.use(express.json())

const PORT = 3000

app.listen(PORT, () => {
    console.log(`Server ready at : localhost:${PORT}`)
})

app.use('/todos', todoRouter)

export default app
