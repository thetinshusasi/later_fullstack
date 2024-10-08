import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { TokensService } from '../token/token.service';
import ITokenPayload from './models/token-payload';
import { UserRole } from '../users/models/enums/user-role.enum';

@Injectable()
export class
    AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private tokensService: TokensService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findByUsername(username);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        try {
            const { username, password } = loginDto;
            const user = await this.validateUser(username, password);
            if (!user) {
                throw new UnauthorizedException('Invalid credentials');
            }
            const payload = { username: user.username, userId: user.id, role: user.role };
            const accessToken = this.jwtService.sign(payload);
            const { userId, role, exp } = this.jwtService.decode(accessToken) as { userId: number; role: UserRole; exp: number };

            const { id } = await this.tokensService.create({
                id: null,
                user: user.id,
                token: accessToken,
                expiresAt: exp,
            });
            const tokenPayload: ITokenPayload = {
                tokenId: id,
                userId: userId,
                username,
                role: role,
                expiresAt: exp,
                token: accessToken,
            };


            return tokenPayload;
        }
        catch (error) {
            console.error('Error during login:', error);
            throw new Error('Login failed');
        }


    }
}
