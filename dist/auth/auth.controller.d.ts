import { AuthService } from './auth.service';
import { RegisterUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import type { Response } from 'express';
export declare class AuthController {
    private readonly authService;
    private readonly userService;
    constructor(authService: AuthService, userService: UserService);
    login(req: any, res: Response): Promise<{
        accessToken: string;
        user: {
            _id: any;
            name: any;
            email: any;
        };
    }>;
    register(registerUserDto: RegisterUserDto): Promise<{
        email: string;
        name: string | undefined;
        _id: any;
    }>;
    refresh(response: Response): Promise<{
        accessToken: string;
        user: {
            _id: any;
            name: string | undefined;
            email: string;
        };
    }>;
    logout(response: Response): Promise<{
        message: string;
    }>;
}
