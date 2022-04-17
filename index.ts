import "reflect-metadata"

import express, { json } from 'express'
import setup, { createJwt, ENV } from "./core/entry";

import TodoRouter from './api/todos'
import GroupsRouter from './api/groups'

import { auth_middleware, setup_middleware } from './api/Middlewares'
import AuthRouter from "./api/auth";

// setups first
setup().then(() => {
    const app = express()

    app.use(setup_middleware)
    app.use(json())
    app.use('/api', auth_middleware)
    app.use('/api', TodoRouter)
    app.use('/api', GroupsRouter)
    app.use('/auth', AuthRouter)

    console.log(ENV)

    createJwt({ data: "Test" }).then(x => console.log(x))

    app.listen(process.env.API_PORT, () => 
        console.log(`
        🚀 Server ready at: http://localhost:${process.env.API_PORT}
        ⭐️ I really hope this fucking works`)
    )
})