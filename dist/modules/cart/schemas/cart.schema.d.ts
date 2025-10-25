import { Document, Types } from 'mongoose';
export type CartDocument = Cart & Document;
declare class CartItem {
    productId: Types.ObjectId;
    quantity: number;
    price: number;
}
export declare class Cart {
    userId: Types.ObjectId;
    items: CartItem[];
    totalAmount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CartSchema: import("mongoose").Schema<Cart, import("mongoose").Model<Cart, any, any, any, Document<unknown, any, Cart> & Cart & {
    _id: Types.ObjectId;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Cart, Document<unknown, {}, import("mongoose").FlatRecord<Cart>> & import("mongoose").FlatRecord<Cart> & {
    _id: Types.ObjectId;
}>;
export {};
