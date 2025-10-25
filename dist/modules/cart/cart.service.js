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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("./schemas/cart.schema");
const product_schema_1 = require("../products/schemas/product.schema");
let CartService = class CartService {
    cartModel;
    productModel;
    constructor(cartModel, productModel) {
        this.cartModel = cartModel;
        this.productModel = productModel;
    }
    async getCart(userId) {
        const cart = await this.cartModel
            .findOne({ userId: new mongoose_2.Types.ObjectId(userId) })
            .populate('items.productId', 'name price image')
            .exec();
        if (!cart) {
            return this.cartModel.create({
                userId: new mongoose_2.Types.ObjectId(userId),
                items: [],
                totalAmount: 0,
            });
        }
        return cart;
    }
    async addToCart(userId, addToCartDto) {
        const { productId, quantity } = addToCartDto;
        const product = await this.productModel.findById(productId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.isDeleted) {
            throw new common_1.BadRequestException('Product is no longer available');
        }
        let cart = await this.cartModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (!cart) {
            cart = new this.cartModel({
                userId: new mongoose_2.Types.ObjectId(userId),
                items: [],
                totalAmount: 0,
            });
        }
        const existingItemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
        }
        else {
            cart.items.push({
                productId: new mongoose_2.Types.ObjectId(productId),
                quantity,
                price: product.price,
            });
        }
        cart.totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        const updatedCart = await this.cartModel
            .findById(cart._id)
            .populate('items.productId', 'name price image')
            .exec();
        return updatedCart;
    }
    async updateCartItem(userId, updateCartItemDto) {
        const { productId, quantity } = updateCartItemDto;
        const cart = await this.cartModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);
        if (itemIndex === -1) {
            throw new common_1.NotFoundException('Product not found in cart');
        }
        cart.items[itemIndex].quantity = quantity;
        cart.totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        const updatedCart = await this.cartModel
            .findById(cart._id)
            .populate('items.productId', 'name price image')
            .exec();
        return updatedCart;
    }
    async removeFromCart(userId, productId) {
        const cart = await this.cartModel.findOne({
            userId: new mongoose_2.Types.ObjectId(userId),
        });
        if (!cart) {
            throw new common_1.NotFoundException('Cart not found');
        }
        cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
        cart.totalAmount = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
        await cart.save();
        const updatedCart = await this.cartModel
            .findById(cart._id)
            .populate('items.productId', 'name price image')
            .exec();
        return updatedCart;
    }
    async clearCart(userId) {
        await this.cartModel.findOneAndUpdate({ userId: new mongoose_2.Types.ObjectId(userId) }, { items: [], totalAmount: 0 });
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], CartService);
//# sourceMappingURL=cart.service.js.map