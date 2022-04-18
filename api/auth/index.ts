import { Request, Response, Router } from 'express'
import { hash, compare } from 'bcryptjs'
import User from '../../core/models/User'
import { createJwt } from '../../core/entry'

const AuthRouter = Router()

type AuthResponse = {
    error: boolean;
    message: string;
    token: string | null
}

type UserDetails = {
    username: string;
    password: string;
}

type TokenPayload = {
    user_id: string;
}

AuthRouter.post('/signup', async (req: Request, res: Response) => {
    const userDetails: UserDetails = req.body

    const response: AuthResponse = {
        error: false,
        message: '',
        token: null
    }

    console.log(` [x] Trying to register user ${userDetails.username}`)

    // let's suppose I'm validating username and password here...
    const userExists = (await User.findOneBy( { Username: userDetails.username } ) !== null)
    if ( userExists ) {
        console.log(` [x] Username ${userDetails.username} already exists.`)

        response.error = true
        response.message = `Username ${userDetails.username} already exists.`
    }
    else {
        let created = new User()
        created.Username = userDetails.username
        created.Password = await hash(userDetails.password, 10)
        created = await created.save()

        const tokenPayload: TokenPayload = { user_id: created.Id }
        response.token = await createJwt(tokenPayload)
    }

    res.send(response)
})

AuthRouter.post('/login', async (req: Request, res: Response) => {
    const userDetails: UserDetails = req.body

    const response: AuthResponse = {
        error: false,
        message: '',
        token: null
    }

    console.log(` [x] Trying to login user ${userDetails.username}`)

    const user = await User.findOneBy( {Username: userDetails.username })
    if ( user === null ) {
        console.log(` [x] Couldn't find username ${userDetails.username}`)
        
        response.error = true
        response.message = `Couldn't find username ${userDetails.username}`
    }
    else {
        // check the password
        const passOk = await compare(userDetails.password, user.Password)
        if ( passOk ) {
            const tokenPayload: TokenPayload = { user_id: user.Id }
            response.token = await createJwt(tokenPayload)
        }
        else {
            console.log(' [x] Invalid password.')
            response.error = true
            response.message = 'Invalid password.'
        }
    }

    res.send(response)
})

export default AuthRouter;