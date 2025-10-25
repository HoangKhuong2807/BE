import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Cart')
@ApiBearerAuth()
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Get user cart' })
  async getCart(@Request() req: any) {
    return this.cartService.getCart(req.user._id as string);
  }

  @Post('add')
  @ApiOperation({ summary: 'Add product to cart' })
  async addToCart(@Request() req: any, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user._id as string, addToCartDto);
  }

  @Put('update')
  @ApiOperation({ summary: 'Update cart item quantity' })
  async updateCartItem(
    @Request() req: any,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(
      req.user._id as string,
      updateCartItemDto,
    );
  }

  @Delete('remove/:productId')
  @ApiOperation({ summary: 'Remove product from cart' })
  async removeFromCart(
    @Request() req: any,
    @Param('productId') productId: string,
  ) {
    return this.cartService.removeFromCart(req.user._id as string, productId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Clear entire cart' })
  async clearCart(@Request() req: any) {
    return this.cartService.clearCart(req.user._id as string);
  }
}
