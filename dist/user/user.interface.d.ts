import mongoose, { Types } from 'mongoose';
export interface IUser extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    role: Types.ObjectId;
    phone?: string;
    address?: string;
    point?: number;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}
