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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
let ProductsService = class ProductsService {
    productModel;
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(createProductDto) {
        const createdProduct = new this.productModel(createProductDto);
        return createdProduct.save();
    }
    async findAll(queryDto) {
        const { page = 1, limit = 10, search, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'desc', } = queryDto;
        const filter = { isDeleted: false };
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            filter.price = {};
            if (minPrice !== undefined)
                filter.price.$gte = minPrice;
            if (maxPrice !== undefined)
                filter.price.$lte = maxPrice;
        }
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.productModel.find(filter).sort(sort).skip(skip).limit(limit).exec(),
            this.productModel.countDocuments(filter).exec(),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            message: 'Products fetched successfully',
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
            },
        };
    }
    async findOne(id) {
        const product = await this.productModel
            .findOne({ _id: id, isDeleted: false })
            .exec();
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(id, updateProductDto) {
        const updatedProduct = await this.productModel
            .findOneAndUpdate({ _id: id, isDeleted: false }, { ...updateProductDto, updatedAt: new Date() }, { new: true })
            .exec();
        if (!updatedProduct) {
            throw new common_1.NotFoundException('Product not found');
        }
        return updatedProduct;
    }
    async remove(id) {
        const result = await this.productModel
            .findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true, updatedAt: new Date() })
            .exec();
        if (!result) {
            throw new common_1.NotFoundException('Product not found');
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map