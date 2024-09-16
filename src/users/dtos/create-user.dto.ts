import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../entities/enums/user-role.enum';

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsEnum(UserRole)
    role?: UserRole;
}
