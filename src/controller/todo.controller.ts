import { Request, Response, NextFunction } from 'express'
import * as todoService from '../service/todo.service'

//POST todos
export const postTodos = (req: Request, res: Response, next: NextFunction) => {
    const response = todoService.postTodo(req.body)
    res.send(response)
}

//GET by id
export const getTodosByID = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const response = await todoService.getTodo(req.params.id)
    res.json(response)
}

//DELETE by id
export const deleteTodosByID = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const response = await todoService.deleteTodo(req.params.id)
    res.json(response)
}

//UPDATE by id
export const updateTodo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const response = await todoService.updateTodo(req.params.id, req.body)
    res.json(response)
}
