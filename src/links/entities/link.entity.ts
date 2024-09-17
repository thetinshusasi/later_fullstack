import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Link {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @IsNotEmpty()
    @IsString()
    originalUrl: string;

    @Column('simple-json')
    parameters: Record<string, any>;

    @Column()
    @IsNotEmpty()
    @IsString()
    newUrl: string;

    @ManyToOne(() => User, user => user.links, { onDelete: 'CASCADE' }) // Specifies the behavior on deletion of the User
    @JoinColumn({ name: 'userId' })
    user: User;
}
