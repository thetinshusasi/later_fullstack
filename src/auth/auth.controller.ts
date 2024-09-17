import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('auth/login')
    @ApiOperation({ summary: 'User login' })
    @ApiResponse({ status: 201, description: 'Login successful', schema: { example: { accessToken: 'jwt_token' } } })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBody({ type: LoginDto })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}