import { Entity, BaseEntity, Column, OneToMany, ManyToOne, PrimaryColumn } from 'typeorm'
import Todo from './Todo';
import User from './User';
import {v4 as uuid} from 'uuid'

@Entity()
export default class Group extends BaseEntity {
    @PrimaryColumn("uuid", {
        default: uuid()
    })
    Id!: string;

    @Column()
    Name!: string

    @OneToMany(() => Todo, t => t.Group)
    TodoList!: Todo[]

    @ManyToOne(() => User, u => u.Groups)
    Owner!: User
}

// const Group = db.define('Todo', {
//     Id: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         primaryKey: true,
//         defaultValue: uuid()
//     },
//     Name: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },

//     UserId: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }, {
//     tableName: 'Todos'
// })

// export function setupGroupModel() {
//     Group.belongsTo(User, {
//         foreignKey: 'UserId'
//     })
// }