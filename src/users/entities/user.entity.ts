import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRole } from './enums/user-role.enum';
import { Token } from 'src/token/entities/token.entity';
import { Link } from 'src/links/entities/link.entity';

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

    @Column({ type: 'bigint' })
    createdAt: number;

    @Column({ type: 'bigint' })
    lastUpdatedAt: number;

    @OneToMany(() => Link, link => link.user)
    links: Link[];

    @OneToMany(() => Token, token => token.user)
    tokens: Token[];
}
