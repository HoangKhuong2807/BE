"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const cart_service_1 = require("../cart/cart.service");
let OrdersService = class OrdersService {
    orderModel;
    cartService;
    constructor(orderModel, cartService) {
        this.orderModel = orderModel;
        this.cartService = cartService;
    }
    async createOrder(userId) {
        const cart = await this.cartService.getCart(userId);
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Cart is empty');
        }
        const orderItems = cart.items.map((item) => ({
            productId: item.productId._id,
            name: item.productId.name,
            price: item.price,
            quantity: item.quantity,
        }));
        const order = new this.orderModel({
            userId: new mongoose_2.Types.ObjectId(userId),
            products: orderItems,
            totalAmount: cart.totalAmount,
            status: 'pending',
            isPaid: false,
        });
        await order.save();
        await this.cartService.clearCart(userId);
        return order;
    }
    async getOrderHistory(userId) {
        return this.orderModel
            .find({ userId: new mongoose_2.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .exec();
    }
    async getOrderById(userId, orderId) {
        const order = await this.orderModel.findOne({
            _id: new mongoose_2.Types.ObjectId(orderId),
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateOrderStatus(orderId, updateOrderStatusDto) {
        const order = await this.orderModel.findById(orderId);
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        order.status = updateOrderStatusDto.status;
        await order.save();
        return order;
    }
    async updatePaymentStatus(orderId, paymentMethod) {
        const order = await this.orderModel.findById(orderId);
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
        order.isPaid = true;
        order.paymentDate = new Date();
        order.paymentMethod = paymentMethod;
        order.status = 'processing';
        await order.save();
        return order;
    }
    async getAllOrders() {
        return this.orderModel.find().sort({ createdAt: -1 }).exec();
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cart_service_1.CartService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map