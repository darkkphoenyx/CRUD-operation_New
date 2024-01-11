import { Router } from 'express'
import * as todoController from '../controller/todo.controller'
const router = Router()

//POST to databse
router.post('/', todoController.postTodos)

//GET todos by id
router.get('/:id', todoController.getTodosByID)

//DELETE by id
router.delete('/:id', todoController.deleteTodosByID)

//UPDATE by id
router.put('/:id', todoController.updateTodo)

export default router
