import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/product.schema").Product;
        errors?: undefined;
    } | {
        success: boolean;
        message: string;
        errors: any;
        data?: undefined;
    }>;
    findAll(queryDto: QueryProductDto): Promise<{
        success: boolean;
        message: string;
        data: (import("mongoose").Document<unknown, {}, import("./schemas/product.schema").ProductDocument> & import("./schemas/product.schema").Product & import("mongoose").Document<any, any, any> & {
            _id: import("mongoose").Types.ObjectId;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    } | {
        success: boolean;
        message: string;
        errors: any;
    }>;
    findOne(id: string): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/product.schema").Product;
        errors?: undefined;
    } | {
        success: boolean;
        message: string;
        errors: any;
        data?: undefined;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<{
        success: boolean;
        message: string;
        data: import("./schemas/product.schema").Product;
        errors?: undefined;
    } | {
        success: boolean;
        message: string;
        errors: any;
        data?: undefined;
    }>;
    remove(id: string): Promise<{
        success: boolean;
        message: string;
        errors?: undefined;
    } | {
        success: boolean;
        message: string;
        errors: any;
    }>;
}
