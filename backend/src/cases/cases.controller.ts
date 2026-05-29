import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CasesService } from './cases.service';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { QueryCasesDto } from './dto/query-cases.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { SafeUser } from '../models/user.model';

@ApiTags('Cases')
@ApiBearerAuth()
@Controller('cases')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CasesController {
  constructor(private readonly casesService: CasesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cases with pagination, filtering, and sorting' })
  @ApiResponse({ status: 200, description: 'Paginated list of cases' })
  findAll(
    @Query() query: QueryCasesDto,
    @CurrentUser() user: SafeUser,
  ) {
    return this.casesService.findAll(query, user.id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get case statistics' })
  @ApiResponse({ status: 200, description: 'Case statistics by status, risk, type, and company' })
  getStats() {
    return this.casesService.getStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get case by ID' })
  @ApiResponse({ status: 200, description: 'Case details' })
  @ApiResponse({ status: 404, description: 'Case not found' })
  findOne(
    @Param('id') id: string,
    @CurrentUser() user: SafeUser,
  ) {
    return this.casesService.findById(id, user.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new verification case' })
  @ApiResponse({ status: 201, description: 'Case created successfully' })
  create(
    @Body() createCaseDto: CreateCaseDto,
    @CurrentUser() user: SafeUser,
  ) {
    return this.casesService.create(createCaseDto, user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a case' })
  @ApiResponse({ status: 200, description: 'Case updated successfully' })
  @ApiResponse({ status: 404, description: 'Case not found' })
  update(
    @Param('id') id: string,
    @Body() updateCaseDto: UpdateCaseDto,
    @CurrentUser() user: SafeUser,
  ) {
    return this.casesService.update(id, updateCaseDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a case' })
  @ApiResponse({ status: 200, description: 'Case deleted successfully' })
  @ApiResponse({ status: 404, description: 'Case not found' })
  remove(
    @Param('id') id: string,
    @CurrentUser() user: SafeUser,
  ) {
    return this.casesService.remove(id, user.id);
  }
}
