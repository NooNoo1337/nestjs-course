import {
    BadRequestException,
    Body,
    Controller,
    HttpCode,
    Inject,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { SignUpUserDto } from './dto/sign-up-user.dto';
import { SignInUserDto } from './dto/sign-in-user.dto';
import { AuthService } from './auth.service';
import { USER_ALREADY_EXISTS_ERROR } from './auth.constants';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AuthService) private readonly authService: AuthService,
    ) {}

    /**
     * By default POST will send 201 status code which means 'created'
     */
    @UsePipes(new ValidationPipe())
    @Post('register')
    async register(@Body() dto: SignUpUserDto) {
        const existingUser = await this.authService.findUser(dto.login);

        if (existingUser) {
            throw new BadRequestException(USER_ALREADY_EXISTS_ERROR);
        }

        return this.authService.createUser(dto);
    }

    @HttpCode(200)
    @Post('login')
    async login(@Body() dto: SignInUserDto) {
        const user = await this.authService.validateUser(
            dto.login,
            dto.password,
        );

        return this.authService.login(user.email);
    }
}
