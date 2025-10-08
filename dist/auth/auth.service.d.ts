import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { Response } from 'express';
export declare class AuthService {
    private userService;
    private jwtService;
    private readonly configService;
    constructor(userService: UserService, jwtService: JwtService, configService: ConfigService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any, res: Response): Promise<{
        accessToken: string;
        user: {
            _id: any;
            name: any;
            email: any;
        };
    }>;
    register(user: RegisterUserDto): Promise<{
        email: string;
        name: string | undefined;
        _id: any;
    }>;
    refreshToken: (refreshToken: string, res: Response) => Promise<{
        accessToken: string;
        user: {
            _id: any;
            name: string | undefined;
            email: string;
        };
    }>;
    logout(res: Response): Promise<{
        message: string;
    }>;
}
