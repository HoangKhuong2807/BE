"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const user_service_1 = require("../user/user.service");
let AuthService = class AuthService {
    userService;
    jwtService;
    configService;
    constructor(userService, jwtService, configService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async validateUser(email, pass) {
        const user = await this.userService.findUserByEmail(email);
        if (!user) {
            return null;
        }
        const isValidPassword = await this.userService.validatePassword(pass, user.password);
        if (!isValidPassword) {
            throw new common_1.BadRequestException('Invalid password');
        }
        return user;
    }
    async login(user, res) {
        const payload = {
            _id: user._id,
            email: user.email,
            username: user.name,
            role: user.role
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
            secret: this.configService.get('JWT_SECRET_TOKEN_SECRET'),
        });
        const refreshToken = await this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_EXPIRATION_REFRESHTOKEN_TIME'),
            secret: this.configService.get('JWT_SECRET_TOKEN_SECRET'),
        });
        const hashedRefreshToken = await this.userService.hashedSomething(refreshToken);
        await this.userService.updateRefreshToken(user._id, hashedRefreshToken);
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return {
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        };
    }
    async register(user) {
        const newUser = await this.userService.register(user);
        if (!newUser) {
            throw new Error('User registration failed');
        }
        const register = {
            email: newUser.email,
            name: newUser.name,
            _id: newUser._id,
        };
        return register;
    }
    refreshToken = async (refreshToken, res) => {
        if (!refreshToken) {
            throw new common_1.BadRequestException('Refresh token not found');
        }
        const user = await this.userService.findUserByAccessToken(refreshToken);
        if (!user) {
            throw new common_1.BadRequestException('Invalid refresh token');
        }
        const payload = {
            _id: user._id,
            email: user.email,
            username: user.name,
        };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
            secret: this.configService.get('JWT_SECRET_TOKEN_SECRET'),
        });
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000,
        });
        return {
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        };
    };
    async logout(res) {
        const refreshToken = res.req.cookies['refreshToken'];
        const user = await this.userService.findUserByAccessToken(refreshToken);
        if (!user || !user._id) {
            return { message: 'User not found or already logged out' };
        }
        const userId = user._id.toString();
        await this.userService.updateRefreshToken(userId, '');
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
        });
        return { message: 'Logout successful' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __metadata("design:paramtypes", [user_service_1.UserService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map