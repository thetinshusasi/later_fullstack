// src/links/entities/link.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Link {
    @ApiProperty({ example: 1, description: 'Unique identifier of the link' })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'https://example.com', description: 'The original URL provided by the user' })
    @Column()
    @IsNotEmpty()
    @IsString()
    originalUrl: string;

    @ApiProperty({
        example: { param1: 'value1', param2: 'value2' },
        description: 'Parameters to append to the URL',
        type: 'object',
    })
    @Column('simple-json')
    parameters: Record<string, any>;

    @ApiProperty({
        example: 'https://example.com?param1=value1&param2=value2',
        description: 'The new URL with appended parameters',
    })
    @Column()
    @IsNotEmpty()
    @IsString()
    newUrl: string;

    @ApiProperty({ description: 'The user who owns the link', type: () => User })
    @ManyToOne(() => User, (user) => user.links, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
