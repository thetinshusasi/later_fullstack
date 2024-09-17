import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ description: 'Username of the user', example: 'john_doe' })
    @IsNotEmpty()
    @IsString()
    username: string;

    @ApiProperty({ description: 'Password of the user', example: 'strongPassword123' })
    @IsNotEmpty()
    @IsString()
    password: string;
}