import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductDto } from './dto/query-product.dto';

@Controller('api/products')
@UsePipes(new ValidationPipe({ transform: true }))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const data = await this.productsService.create(createProductDto);
      return {
        success: true,
        message: 'Product created successfully',
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to create product',
        errors: error.message,
      };
    }
  }

  @Get()
  async findAll(@Query() queryDto: QueryProductDto) {
    try {
      return await this.productsService.findAll(queryDto);
    } catch (error) {
      return {
        success: false,
        message: 'Failed to fetch products',
        errors: error.message,
      };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const data = await this.productsService.findOne(id);
      return {
        success: true,
        message: 'Product fetched successfully',
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Product not found',
        errors: error.message,
      };
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const data = await this.productsService.update(id, updateProductDto);
      return {
        success: true,
        message: 'Product updated successfully',
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to update product',
        errors: error.message,
      };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.productsService.remove(id);
      return {
        success: true,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to delete product',
        errors: error.message,
      };
    }
  }
}
