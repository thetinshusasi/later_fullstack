import { Controller, Request, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';

@Controller()
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('auth/login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }
}
