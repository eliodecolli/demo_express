import { Entity, BaseEntity, Column, ManyToOne, PrimaryColumn } from 'typeorm'
import Group from './Group'
import User from './User'
import {v4 as uuid} from 'uuid'

@Entity()
export default class Todo extends BaseEntity {
    @PrimaryColumn("uuid", {
        default: uuid()
    })
    Id!: string

    @Column()
    Text!: string

    @Column({default: false})
    Completed!: boolean

    @ManyToOne(() => Group, g => g.TodoList)
    Group!: Group

    @ManyToOne(() => User)
    Owner!: User
}

// const Todo = db.define('Todo', {
//     Id: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         primaryKey: true,
//         defaultValue: uuid()
//     },
//     Text: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },

//     GroupId: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },

//     UserId: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },

//     IsCompleted: {
//         type: DataTypes.BOOLEAN,
//         defaultValue: false
//     }
// }, {
//     tableName: 'Todos'
// })

// export function setupTodoModel() {
//     Todo.belongsTo(Group, {
//         foreignKey: 'GroupId'
//     })
    
//     Todo.belongsTo(User, {
//         foreignKey: 'UserId'
//     })
// }

// export default Todo;