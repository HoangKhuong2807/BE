import { JwtService } from '@nestjs/jwt';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './user.interface';
import { User, UserDocument } from './schemas/user.schema';
import type { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose, { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { PaginationResult, SearchUserDto } from './dto/user.dto';
import { PaginationResponseDto } from '../common/dto/pagination.dto';
export declare class UserService {
    private userModel;
    private readonly JwtService;
    private readonly configService;
    constructor(userModel: SoftDeleteModel<UserDocument>, JwtService: JwtService, configService: ConfigService);
    hashedSomething: (something: string) => Promise<string>;
    findByEmail: (email: string) => Promise<(mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }) | null>;
    createUser(createUserDto: CreateUserDto, user: IUser): Promise<(mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }) | null>;
    searchUsers(query: SearchUserDto): Promise<PaginationResponseDto<User>>;
    private parseQueryString;
    private buildMongoFilter;
    searchUsersByRoleName(query: SearchUserDto): Promise<PaginationResult<User>>;
    findOneID(id: string): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }>;
    countUsers(): Promise<number>;
    update(id: string, updateUserDto: UpdateUserDto, user?: IUser): Promise<(mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }) | null>;
    remove(id: string, user: IUser): Promise<{
        message: string;
        deletedBy: {
            _id: Types.ObjectId;
            email: string;
        };
    }>;
    validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    findUserByEmail(email: string): Promise<User | null>;
    findUserWithRoleAndPermissions(userId: string): Promise<User | null>;
    register(user: RegisterUserDto): Promise<mongoose.Document<unknown, {}, mongoose.Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }> & mongoose.Document<unknown, {}, User> & User & {
        _id: Types.ObjectId;
    }>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    findUserByAccessToken(accessToken: string): Promise<User>;
}
