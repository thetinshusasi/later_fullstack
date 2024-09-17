import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../models/enums/user-role.enum';
import { Link } from '../../links/entities/link.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Token } from '../../token/entities/token.entity';

@Entity()
export class User {
    @ApiProperty({ example: 1, description: 'Unique identifier of the user' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'john_doe', description: 'Username chosen by the user' })
    @Column({ unique: true })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ example: 'hashedpassword', description: 'User password (hashed)', writeOnly: true })
    @Column()
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({ example: UserRole.CUSTOMER, enum: UserRole, description: 'Role assigned to the user' })
    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    @IsEnum(UserRole)
    role: UserRole;

    @ApiProperty({ example: 1609459200000, description: 'Timestamp when the user was created' })
    @Column({ type: 'bigint' })
    createdAt: number;

    @ApiProperty({ example: 1609545600000, description: 'Timestamp when the user was last updated' })
    @Column({ type: 'bigint' })
    lastUpdatedAt: number;

    @ApiProperty({ description: 'Links associated with the user', type: () => [Link] })
    @OneToMany(() => Link, (link) => link.user)
    links: Link[];

    @ApiProperty({ description: 'Tokens associated with the user', type: () => [Token] })
    @OneToMany(() => Token, (token) => token.user)
    tokens: Token[];
}
