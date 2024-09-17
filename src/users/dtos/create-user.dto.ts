import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../models/enums/user-role.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'Username of the user', example: 'john_doe' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ description: 'Password of the user', example: 'strongPassword123' })
    @IsNotEmpty()
    @IsString()
    password: string;

    @ApiProperty({
        description: 'Role of the user',
        enum: UserRole,
        example: UserRole.CUSTOMER,
        required: false,
    })
    @IsEnum(UserRole)
    role?: UserRole;
}
