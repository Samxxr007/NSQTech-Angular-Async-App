import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CaseStatus,
  RiskLevel,
  VerificationType,
} from '../../models/case.model';

export class CreateCaseDto {
  @ApiProperty({ example: 'Amit Kumar' })
  @IsString()
  @IsNotEmpty({ message: 'Candidate name is required' })
  candidateName!: string;

  @ApiProperty({ example: 'amit.kumar@email.com' })
  @IsEmail({}, { message: 'Please provide a valid candidate email' })
  @IsNotEmpty({ message: 'Candidate email is required' })
  candidateEmail!: string;

  @ApiProperty({ example: 'TCS' })
  @IsString()
  @IsNotEmpty({ message: 'Company is required' })
  company!: string;

  @ApiProperty({ example: 'Senior Software Engineer' })
  @IsString()
  @IsNotEmpty({ message: 'Position is required' })
  position!: string;

  @ApiProperty({ enum: VerificationType, example: VerificationType.Employment })
  @IsEnum(VerificationType, { message: 'Invalid verification type' })
  verificationType!: VerificationType;

  @ApiPropertyOptional({ enum: RiskLevel, example: RiskLevel.Medium })
  @IsOptional()
  @IsEnum(RiskLevel, { message: 'Invalid risk level' })
  riskLevel?: RiskLevel;

  @ApiPropertyOptional({ example: 'user-id-here' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 'Initial notes about the case' })
  @IsOptional()
  @IsString()
  notes?: string;
}
