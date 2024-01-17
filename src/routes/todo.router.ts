/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import * as todoController from '../controller/todo.controller'
import { validateByBody, validateByid } from '../util/validate'
import { postTodoValidatorDTO } from '../validators/postTodo.validator'
import { getTodoDTO } from '../validators/getTodo.validator'
import { deleteTodoDTO } from '../validators/deleteTodo.validator'
import {
    updateTodoDTObody,
    updateTodoDTOid,
} from '../validators/updateTodo.validator'
import { authenticateToken, isAdmin } from '../middlewares/authentication.middleware'
const router = Router()

//POST to databse
router.post('/',validateByBody(postTodoValidatorDTO),authenticateToken,todoController.postTodos)

//GET all todos
router.get('/',authenticateToken,isAdmin,todoController.getTodos)

//GET todos by id
router.get('/:id', validateByid(getTodoDTO),authenticateToken,todoController.getTodosByID)

//DELETE by id
router.delete(
    '/:id',
    validateByid(deleteTodoDTO),authenticateToken,isAdmin,   //isadmin not working
    todoController.deleteTodosByID
)

//UPDATE by id--Put method
//update by patch method not working
router.put('/:id', validateByid(updateTodoDTOid), validateByBody(updateTodoDTObody),authenticateToken,todoController.updateTodo)

export default router
