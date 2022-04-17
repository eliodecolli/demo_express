import { Entity, BaseEntity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import Group from './Group'
import User from './User'
import {v4 as uuid} from 'uuid'

@Entity()
export default class Todo extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    Id!: string

    @Column()
    Text!: string

    @Column({default: false})
    Completed!: boolean

    @ManyToOne(() => Group, g => g.TodoList, { onDelete: 'CASCADE' })
    Group!: Group

    @ManyToOne(() => User, { cascade: true })
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