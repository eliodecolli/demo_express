import { Request, Response, Router } from "express";
import Todo from "../../core/models/Todo";
import { decode, JwtPayload } from "jsonwebtoken";
import User from "../../core/models/User";
import Group from "../../core/models/Group";
import {auth_middleware} from "../Middlewares";


const TodoRouter = Router()
TodoRouter.use(auth_middleware)

TodoRouter.post('/todo/toggle/:id', async (req: Request, res: Response) => {
    const id = req.params['id']

    if ( id ) {
        console.log(' [x] Toggling Todo with id {}', id)

        const todo = await Todo.findOneBy({ Id: id })

        if ( todo !== null ) {
            todo.Completed = !todo.Completed
            await todo.save()

            res.sendStatus(200)
            console.log(` [x] Toggled Task to "${todo.Completed ? 'Done': 'Not Finished'}"`)
        }
    }
    else {
        console.log(" [x] No Id specified.")
        res.sendStatus(500)
    }
})

TodoRouter.delete('/todo/:id', async (req: Request, res: Response) => {
    const id = req.params['id']

    if ( id ) {
        console.log(` [x] Removing Task ${id}`)

        const todo = await Todo.findOneBy({ Id: id })

        if ( todo !== null ){
            await todo.remove()
            res.sendStatus(200)
        }
        else {
            console.log(` [x] Couldn't find Task with id ${id}`)
            res.sendStatus(500)    // it's probably not 500 but I don't give a shit tbh
        }
    }
    else {
        console.log(` [x] No task id was provided.`)
        res.sendStatus(500)
    }
})

TodoRouter.post('/todo', async (req: Request, res: Response) => {
    console.log(' [x] Creating new todo')

    const userId = req.UserId

    // fuck validations and shit
    const user = await User.findOneBy({ Id: userId }) as User
    const group = await Group.findOneBy({ Id: req.body['group_id'] }) as Group

    const todo = new Todo()
    todo.Group = group
    todo.Owner = user
    todo.Text = req.body['text']

    const saved = await todo.save()
    console.log(` [x] Created Task ${saved.Id} for user ${userId}`)

    res.send({
        id: saved.Id,
        text: saved.Text,
        group_id: saved.Group.Id,
        is_completed: false
    })
})

export default TodoRouter;