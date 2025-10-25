import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CartService } from '../cart/cart.service';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private cartService: CartService,
  ) {}

  async createOrder(userId: string): Promise<Order> {
    // Get user's cart
    const cart = await this.cartService.getCart(userId);

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Create order from cart items
    const orderItems = cart.items.map((item: any) => ({
      productId: item.productId._id as string,
      name: item.productId.name as string,
      price: item.price as number,
      quantity: item.quantity as number,
    }));

    const order = new this.orderModel({
      userId: new Types.ObjectId(userId),
      products: orderItems,
      totalAmount: cart.totalAmount,
      status: 'pending',
      isPaid: false,
    });

    await order.save();

    // Clear the cart after creating order
    await this.cartService.clearCart(userId);

    return order;
  }

  async getOrderHistory(userId: string): Promise<Order[]> {
    return this.orderModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async getOrderById(userId: string, orderId: string): Promise<Order> {
    const order = await this.orderModel.findOne({
      _id: new Types.ObjectId(orderId),
      userId: new Types.ObjectId(userId),
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async updateOrderStatus(
    orderId: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = updateOrderStatusDto.status;
    await order.save();

    return order;
  }

  async updatePaymentStatus(
    orderId: string,
    paymentMethod: string,
  ): Promise<Order> {
    const order = await this.orderModel.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.isPaid = true;
    order.paymentDate = new Date();
    order.paymentMethod = paymentMethod;
    order.status = 'processing';
    await order.save();

    return order;
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderModel.find().sort({ createdAt: -1 }).exec();
  }
}
