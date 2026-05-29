import {
  IsEnum,
  IsOptional,
  IsString,
  IsEmail,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  CaseStatus,
  RiskLevel,
  VerificationType,
} from '../../models/case.model';

export class UpdateCaseDto {
  @ApiPropertyOptional({ example: 'Amit Kumar' })
  @IsOptional()
  @IsString()
  candidateName?: string;

  @ApiPropertyOptional({ example: 'amit.kumar@email.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid candidate email' })
  candidateEmail?: string;

  @ApiPropertyOptional({ example: 'Infosys' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ example: 'Project Manager' })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({ enum: VerificationType })
  @IsOptional()
  @IsEnum(VerificationType, { message: 'Invalid verification type' })
  verificationType?: VerificationType;

  @ApiPropertyOptional({ enum: CaseStatus })
  @IsOptional()
  @IsEnum(CaseStatus, { message: 'Invalid status' })
  status?: CaseStatus;

  @ApiPropertyOptional({ enum: RiskLevel })
  @IsOptional()
  @IsEnum(RiskLevel, { message: 'Invalid risk level' })
  riskLevel?: RiskLevel;

  @ApiPropertyOptional({ example: 'user-id-here' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiPropertyOptional({ example: 'Updated findings after investigation' })
  @IsOptional()
  @IsString()
  findings?: string;

  @ApiPropertyOptional({ example: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
