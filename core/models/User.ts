import { Entity, BaseEntity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import Group from './Group'
import {v4 as uuid} from 'uuid'

@Entity()
export default class User extends BaseEntity {
    
    @PrimaryGeneratedColumn("uuid")
    Id!: string

    @Column()
    Username!: string

    @Column()
    Password!: string


    @OneToMany(() => Group, g => g.Owner)
    Groups!: Group[]
}

// const User = db.define('User', {
//     Id: {
//         type: DataTypes.STRING,
//         primaryKey: true,
//         defaultValue: uuid()
//     },
//     username: DataTypes.STRING,
//     password: DataTypes.STRING,

//     Groups: DataTypes.ARRAY
// })

// export default User;