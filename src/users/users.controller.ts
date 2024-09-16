import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UsersController {

    @Get()
    getData() {
        return "thi"
    }
}
