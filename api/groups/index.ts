import { Request, Response, Router } from "express";
import { decode, JwtPayload } from "jsonwebtoken";
import Group from "../../core/models/Group";
import User from "../../core/models/User";
import {auth_middleware} from "../Middlewares";

const GroupsRouter = Router()
GroupsRouter.use(auth_middleware)

GroupsRouter.post('/groups', async (req: Request, res: Response) => {
    console.log(' [x] Creating new Group')

    let token = req.get('X-Token')
    
    if ( token !== undefined ) {
        const decoded = decode(token) as JwtPayload

        if ( decoded !== null ) {
            const userId = decoded['user_id']
            
            const user = await User.findOneBy({ Id: userId }) as User
            const group = new Group()
            group.Name = req.body['group_name']
            group.Owner = user

            const saved = await group.save()
            console.log(` [x] Created group ${group.Name} with id ${saved.Id} for user ${user.Username}`)

            res.send({
                group_id: saved.Id,
                group_name: saved.Name
            })
        }
    }
})

GroupsRouter.get('/groups', async (req: Request, res: Response) => {
    
    let token = req.get('X-Token')
    
    if ( token !== undefined ) {
        const decoded = decode(token) as JwtPayload

        if ( decoded !== null ) {
            const userId = decoded['user_id']
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
                console.log(x)
                return {
                    group_id: x.Id,
                    name: x.Name,
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
        }
    }
})

export default GroupsRouter;