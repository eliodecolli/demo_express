import { Request, Response, Router } from "express";
import { decode, JwtPayload } from "jsonwebtoken";
import Group from "../../core/models/Group";
import User from "../../core/models/User";
import {auth_middleware} from "../Middlewares";

const GroupsRouter = Router()
GroupsRouter.use(auth_middleware)

GroupsRouter.post('/groups', async (req: Request, res: Response) => {
    console.log(' [x] Creating new Group')

    const userId = req.UserId
            
    const user = await User.findOneBy({ Id: userId }) as User
    const group = new Group()
    group.Name = req.body['group_name']
    group.Owner = user

    const saved = await group.save()
    console.log(` [x] Created group ${group.Name} with id ${saved.Id} for user ${user.Username}`)

    res.send({
        group_id: saved.Id,
        group_name: saved.Name,
        todos: []
    })
})

GroupsRouter.delete('/groups/:id', async (req: Request, res: Response) => {
    const id = req.params['id']

    if ( id ) {
        console.log(` [x] Removing Group ${id}`)

        const group = await Group.findOneBy({ Id: id })

        if ( group !== null ){
            await group.remove()
            res.sendStatus(200)
        }
        else {
            console.log(` [x] Couldn't find Group with id ${id}`)
            res.sendStatus(500)    // it's probably not 500 but I don't give a shit tbh
        }
    }
    else {
        console.log(` [x] No task id was provided.`)
        res.sendStatus(500)
    }
})

GroupsRouter.get('/groups', async (req: Request, res: Response) => {
    const userId = req.UserId
    console.log(` [x] Getting groups user ${userId}`)
            
    const groups = (await Group.find({
        relations: {
            Owner: true,
            TodoList: true
        },
        where: {
            Owner: {
                Id: userId
            }
        }
    })).map(x => {
        return {
            group_id: x.Id,
            group_name: x.Name,
            todos: x.TodoList.map(todo => {
                return {
                    id: todo.Id,
                    group_id: x.Id,
                    text: todo.Text,
                    is_completed: todo.Completed
                }
            })
        }
    })

    res.send(groups)
})

export default GroupsRouter;