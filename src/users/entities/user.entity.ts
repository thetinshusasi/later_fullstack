import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { UserRole } from './enums/user-role.enum';



@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    password: string; // In production, hash passwords

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.CUSTOMER,
    })
    role: UserRole;

    @Column()
    createdAt: number;

    @Column()
    lastUpdatedAt: number;
}
