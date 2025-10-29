import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from 'src/user/schemas/user.schema';
import { Model } from 'mongoose';
interface IAuthUser {
    _id: string;
    email: string;
}
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly userModel;
    constructor(configService: ConfigService, userModel: Model<UserDocument>);
    validate(payload: any): Promise<IAuthUser>;
}
export {};
