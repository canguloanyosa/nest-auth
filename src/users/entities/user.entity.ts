import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from '../../roles/entities/role.entity';

@Entity()
export class User {

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
    username: string;

    @Column({
        type: 'varchar',
        length: 60,
        select: false
    })
    password: string

    @Column({
        type: 'tinyint',
        width: 1,
        default: 1
    })
    isActive: boolean;

    @CreateDateColumn()
    createdDate: Date

    @UpdateDateColumn()
    updatedDate: Date

    @ManyToMany(() => Role, (role) => role.users)
    roles: Role[]

}




