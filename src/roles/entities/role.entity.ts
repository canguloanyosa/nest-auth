import { PrimaryGeneratedColumn, Entity, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    @Column({
        primary: true,
        type: 'int',
        unique: true
    })
    id: number;

    @Column({
        type: 'varchar',
        length: 45,
        unique: true
    })
    name: string

    @Column({
        type: 'varchar',
        length: 100
    })
    description: string

    @ManyToMany(() => User, (user) => user.roles)
    @JoinTable(
        {
            name: 'user_role',
            joinColumn: {
                name: 'role',
                referencedColumnName: 'id'
            },
            inverseJoinColumn: {
                name: 'user',
                referencedColumnName: 'id'
            }
        }
    )
    users: User[];
}
