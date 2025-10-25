import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(req: any): Promise<import("./schemas/cart.schema").Cart>;
    addToCart(req: any, addToCartDto: AddToCartDto): Promise<import("./schemas/cart.schema").Cart>;
    updateCartItem(req: any, updateCartItemDto: UpdateCartItemDto): Promise<import("./schemas/cart.schema").Cart>;
    removeFromCart(req: any, productId: string): Promise<import("./schemas/cart.schema").Cart>;
    clearCart(req: any): Promise<void>;
}
