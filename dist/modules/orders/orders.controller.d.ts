import { OrdersService } from './orders.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createOrder(req: any): Promise<import("./schemas/order.schema").Order>;
    getOrderHistory(req: any): Promise<import("./schemas/order.schema").Order[]>;
    getOrderById(req: any, orderId: string): Promise<import("./schemas/order.schema").Order>;
    updateOrderStatus(orderId: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<import("./schemas/order.schema").Order>;
    updatePaymentStatus(orderId: string, body: {
        paymentMethod: string;
    }): Promise<import("./schemas/order.schema").Order>;
}
