import { Injectable, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { TokensService } from 'src/token/token.service';
import { getCurrentTimeInSeconds } from 'src/utils/dateHelper';


@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private tokensService: TokensService, private jwtService: JwtService) {
        super();
        console.log('TokensService in JwtAuthGuard:', this.tokensService);


    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const can = (await super.canActivate(context)) as boolean;
        if (!can) {
            return false;
        }
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization.split(' ')[1];
        const payload = request.user;
        const decodeToken = this.jwtService.decode(token);
        const { userId, exp } = decodeToken

        const latestToken = await this.tokensService.findByUserIdAndToken(userId, token);
        const currentTime = getCurrentTimeInSeconds();
        if (latestToken && currentTime <= exp) {
            return true;
        }
        return false;
    }
}
