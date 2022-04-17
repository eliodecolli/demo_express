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

TodoRouter.post('/todo', async (req: Request, res: Response) => {
    console.log(' [x] Creating new todo')

    let token = req.get('X-Token')
    
    if ( token !== undefined ) {
        const decoded = decode(token) as JwtPayload

        if ( decoded !== null ) {
            const userId = decoded['user_id']

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
                todo_id: saved.Id,
                todo_text: saved.Text,
                group_id: saved.Group.Id
            })
        }
    }
})

export default TodoRouter;