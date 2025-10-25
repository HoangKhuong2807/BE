import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { ProductDocument } from '../products/schemas/product.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
export declare class CartService {
    private cartModel;
    private productModel;
    constructor(cartModel: Model<CartDocument>, productModel: Model<ProductDocument>);
    getCart(userId: string): Promise<Cart>;
    addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart>;
    updateCartItem(userId: string, updateCartItemDto: UpdateCartItemDto): Promise<Cart>;
    removeFromCart(userId: string, productId: string): Promise<Cart>;
    clearCart(userId: string): Promise<void>;
}
