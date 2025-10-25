import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Create order from cart' })
  async createOrder(@Request() req: any) {
    return this.ordersService.createOrder(req.user._id as string);
  }

  @Get()
  @ApiOperation({ summary: 'Get user order history' })
  async getOrderHistory(@Request() req: any) {
    return this.ordersService.getOrderHistory(req.user._id as string);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  async getOrderById(@Request() req: any, @Param('id') orderId: string) {
    return this.ordersService.getOrderById(req.user._id as string, orderId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  async updateOrderStatus(
    @Param('id') orderId: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(orderId, updateOrderStatusDto);
  }

  @Post(':id/payment')
  @ApiOperation({ summary: 'Update payment status' })
  async updatePaymentStatus(
    @Param('id') orderId: string,
    @Body() body: { paymentMethod: string },
  ) {
    return this.ordersService.updatePaymentStatus(
      orderId,
      body.paymentMethod || 'card',
    );
  }
}
