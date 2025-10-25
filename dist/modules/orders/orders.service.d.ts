import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersService {
    private orderModel;
    private cartService;
    constructor(orderModel: Model<OrderDocument>, cartService: CartService);
    createOrder(userId: string): Promise<Order>;
    getOrderHistory(userId: string): Promise<Order[]>;
    getOrderById(userId: string, orderId: string): Promise<Order>;
    updateOrderStatus(orderId: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<Order>;
    updatePaymentStatus(orderId: string, paymentMethod: string): Promise<Order>;
    getAllOrders(): Promise<Order[]>;
}
