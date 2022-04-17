import { DataSource } from "typeorm";
import Group from "./models/Group";
import Todo from "./models/Todo";
import User from "./models/User";


export const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "admin",
    password: "admin",
    database: "demo_express",
    synchronize: true,
    entities: [
        User,
        Group,
        Todo
    ]
})