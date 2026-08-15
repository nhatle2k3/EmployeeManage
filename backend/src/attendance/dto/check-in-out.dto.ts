import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CheckInOutDto {
  @ApiPropertyOptional({ example: 'DEV-FINGERPRINT-123' })
  @IsString()
  @IsOptional()
  deviceId?: string;

  @ApiPropertyOptional({ example: 'MacBook Pro M2' })
  @IsString()
  @IsOptional()
  deviceName?: string;

  @ApiPropertyOptional({ example: 'Check in from web kiosk' })
  @IsString()
  @IsOptional()
  remarks?: string;
}
