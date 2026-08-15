import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { EmploymentStatus, RoleEnum } from '@prisma/client';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'EMP005' })
  @IsString()
  @IsNotEmpty()
  employeeCode: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'john.doe@hrms.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiPropertyOptional({ example: '+84909876543' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Male' })
  @IsString()
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({ example: '1995-05-15' })
  @IsOptional()
  dob?: string;

  @ApiPropertyOptional({ example: '123 Main St, HCM' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ example: '001095999888' })
  @IsString()
  @IsOptional()
  nationalId?: string;

  @ApiPropertyOptional({ example: '8099887766' })
  @IsString()
  @IsOptional()
  taxId?: string;

  @ApiPropertyOptional({ example: '998877665544' })
  @IsString()
  @IsOptional()
  bankAccount?: string;

  @ApiPropertyOptional({ example: 'Vietcombank' })
  @IsString()
  @IsOptional()
  bankName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  departmentId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  positionId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  managerId?: string;

  @ApiPropertyOptional({ example: '2024-01-01' })
  @IsOptional()
  hireDate?: string;

  @ApiPropertyOptional({ enum: EmploymentStatus, default: EmploymentStatus.ACTIVE })
  @IsEnum(EmploymentStatus)
  @IsOptional()
  status?: EmploymentStatus;

  @ApiPropertyOptional({ enum: RoleEnum, default: RoleEnum.EMPLOYEE })
  @IsEnum(RoleEnum)
  @IsOptional()
  role?: RoleEnum;
}
