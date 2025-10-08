import mongoose, { HydratedDocument, Types } from 'mongoose';
export type UserDocument = HydratedDocument<User>;
export declare class User extends mongoose.Document {
    name?: string;
    email: string;
    password: string;
    isMember: boolean;
    phone?: string;
    address?: string;
    avatar?: string;
    transactions: mongoose.Types.ObjectId[];
    createdBy?: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    updatedBy?: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    deletedBy?: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    };
    refreshToken?: string;
    createdAt: Date;
    updatedAt: Date;
    isDeleted?: boolean;
    deletedAt?: Date;
}
export declare const UserSchema: mongoose.Schema<User, mongoose.Model<User, any, any, any, mongoose.Document<unknown, any, User> & User & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, User, mongoose.Document<unknown, {}, mongoose.FlatRecord<User>> & mongoose.FlatRecord<User> & {
    _id: Types.ObjectId;
}>;
