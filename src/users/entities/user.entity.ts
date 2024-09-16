import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from './enums/user-role.enum';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';


@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;


    @Column({ unique: true })
    @IsNotEmpty()
    @IsString()
    username: string;

    @Column()
    @IsNotEmpty()
    @IsString()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    @IsEnum(UserRole)
    role: UserRole;

    @Column({
        type: 'bigint',

    })
    createdAt: number;

    @Column({
        type: 'bigint',

    })
    lastUpdatedAt: number;
}