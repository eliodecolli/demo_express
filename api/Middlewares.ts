import { Request, Response } from 'express'
import { decode, Jwt, JwtPayload, verify } from 'jsonwebtoken'
import { ENV } from '../core/entry'

export function auth_middleware(req: Request, res: Response, next: any) {
    const token = req.get('X-Token')
    if ( token === undefined ) { 
        console.log(' [x] Error: Token not defined in request. :(')
        res.sendStatus(401)
    }
    else {
        // @ts-ignore - ENV is handled via middleware
        verify(token, ENV.privateKey, (error, decoded: JwtPayload) => {
            if ( error === null ) {
                req.UserId = decoded['user_id']
                next()
            }
            else {
                console.log(` [x] Error verifying user token: ${error.message}`)
                res.sendStatus(401)
            }
        })
    }
}

export function setup_middleware(_req: Request, res: Response, next: any) {
    if ( ENV.Setup )
        next()
    else {
        console.log( ` [x] Please finish setting up the server!`)
        res.sendStatus(500)
    }
}