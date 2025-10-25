import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrderStatusDto {
  @ApiProperty({
    example: 'processing',
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
  })
  @IsNotEmpty()
  @IsEnum(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
  status: string;
}
