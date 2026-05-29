import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database/database.service';
import { VerificationCase, CaseStatus, RiskLevel } from '../models/case.model';
import { CreateCaseDto } from './dto/create-case.dto';
import { UpdateCaseDto } from './dto/update-case.dto';
import { QueryCasesDto } from './dto/query-cases.dto';
import { AuditService } from '../audit/audit.service';
import { AuditAction } from '../models/audit.model';

export interface PaginatedResult {
  data: VerificationCase[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class CasesService {
  private readonly logger = new Logger(CasesService.name);
  private caseCounter = 1020; // Start after seed data

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly auditService: AuditService,
  ) {}

  findAll(query: QueryCasesDto, currentUserId: string): PaginatedResult {
    let cases: VerificationCase[] = this.databaseService.getCases().value();

    // Apply filters
    if (query.status) {
      cases = cases.filter((c: VerificationCase) => c.status === query.status);
    }

    if (query.riskLevel) {
      cases = cases.filter((c: VerificationCase) => c.riskLevel === query.riskLevel);
    }

    if (query.verificationType) {
      cases = cases.filter((c: VerificationCase) => c.verificationType === query.verificationType);
    }

    if (query.company) {
      cases = cases.filter((c: VerificationCase) =>
        c.company.toLowerCase().includes(query.company!.toLowerCase()),
      );
    }

    if (query.assignedTo) {
      cases = cases.filter((c: VerificationCase) => c.assignedTo === query.assignedTo);
    }

    // Apply search
    if (query.search) {
      const searchLower = query.search.toLowerCase();
      cases = cases.filter(
        (c: VerificationCase) =>
          c.candidateName.toLowerCase().includes(searchLower) ||
          c.candidateEmail.toLowerCase().includes(searchLower) ||
          c.company.toLowerCase().includes(searchLower) ||
          c.caseNumber.toLowerCase().includes(searchLower) ||
          c.position.toLowerCase().includes(searchLower),
      );
    }

    const total = cases.length;

    // Apply sorting
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    cases.sort((a: VerificationCase, b: VerificationCase) => {
      const aVal = (a as Record<string, any>)[sortBy];
      const bVal = (b as Record<string, any>)[sortBy];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

    // Apply pagination
    const page = parseInt(query.page || '1', 10);
    const limit = parseInt(query.limit || '10', 10);
    const startIndex = (page - 1) * limit;
    const paginatedCases = cases.slice(startIndex, startIndex + limit);

    this.auditService.log({
      userId: currentUserId,
      action: AuditAction.ViewCases,
      resource: 'Case',
      resourceId: null,
      details: `Viewed cases list (page ${page}, ${total} total)`,
    });

    return {
      data: paginatedCases,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findById(id: string, currentUserId: string): VerificationCase {
    const verificationCase: VerificationCase | undefined = this.databaseService
      .getCases()
      .find({ id })
      .value();

    if (!verificationCase) {
      throw new NotFoundException(`Case with ID "${id}" not found`);
    }

    this.auditService.log({
      userId: currentUserId,
      action: AuditAction.ViewCase,
      resource: 'Case',
      resourceId: id,
      details: `Viewed case: ${verificationCase.caseNumber}`,
    });

    return verificationCase;
  }

  create(createCaseDto: CreateCaseDto, currentUserId: string): VerificationCase {
    this.caseCounter++;
    const now = new Date().toISOString();

    const newCase: VerificationCase = {
      id: uuidv4(),
      caseNumber: `MPC-2024-${String(this.caseCounter).padStart(4, '0')}`,
      candidateName: createCaseDto.candidateName,
      candidateEmail: createCaseDto.candidateEmail,
      company: createCaseDto.company,
      position: createCaseDto.position,
      verificationType: createCaseDto.verificationType,
      status: CaseStatus.Pending,
      riskLevel: createCaseDto.riskLevel || RiskLevel.Medium,
      assignedTo: createCaseDto.assignedTo || currentUserId,
      findings: '',
      notes: createCaseDto.notes || '',
      createdAt: now,
      updatedAt: now,
      completedAt: null,
    };

    this.databaseService.getCases().push(newCase).write();

    this.auditService.log({
      userId: currentUserId,
      action: AuditAction.CreateCase,
      resource: 'Case',
      resourceId: newCase.id,
      details: `Created case ${newCase.caseNumber} for ${newCase.candidateName} at ${newCase.company}`,
    });

    this.logger.log(`Case created: ${newCase.caseNumber}`);

    return newCase;
  }

  update(id: string, updateCaseDto: UpdateCaseDto, currentUserId: string): VerificationCase {
    const existingCase: VerificationCase | undefined = this.databaseService
      .getCases()
      .find({ id })
      .value();

    if (!existingCase) {
      throw new NotFoundException(`Case with ID "${id}" not found`);
    }

    const updateData: Partial<VerificationCase> = {
      ...updateCaseDto,
      updatedAt: new Date().toISOString(),
    };

    // Automatically set completedAt when status changes to Completed
    if (updateCaseDto.status === CaseStatus.Completed && existingCase.status !== CaseStatus.Completed) {
      updateData.completedAt = new Date().toISOString();
    }

    // Clear completedAt if moving away from Completed
    if (updateCaseDto.status && updateCaseDto.status !== CaseStatus.Completed) {
      updateData.completedAt = null;
    }

    this.databaseService
      .getCases()
      .find({ id })
      .assign(updateData)
      .write();

    this.auditService.log({
      userId: currentUserId,
      action: AuditAction.UpdateCase,
      resource: 'Case',
      resourceId: id,
      details: `Updated case ${existingCase.caseNumber}`,
    });

    this.logger.log(`Case updated: ${existingCase.caseNumber}`);

    return this.databaseService.getCases().find({ id }).value();
  }

  remove(id: string, currentUserId: string): { message: string } {
    const existingCase: VerificationCase | undefined = this.databaseService
      .getCases()
      .find({ id })
      .value();

    if (!existingCase) {
      throw new NotFoundException(`Case with ID "${id}" not found`);
    }

    this.databaseService.getCases().remove({ id }).write();

    this.auditService.log({
      userId: currentUserId,
      action: AuditAction.DeleteCase,
      resource: 'Case',
      resourceId: id,
      details: `Deleted case ${existingCase.caseNumber}`,
    });

    this.logger.log(`Case deleted: ${existingCase.caseNumber}`);

    return { message: `Case "${existingCase.caseNumber}" has been deleted` };
  }

  getStats(): Record<string, any> {
    const cases: VerificationCase[] = this.databaseService.getCases().value();

    const statusCounts: Record<string, number> = {};
    const riskCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    const companyCounts: Record<string, number> = {};

    cases.forEach((c: VerificationCase) => {
      statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
      riskCounts[c.riskLevel] = (riskCounts[c.riskLevel] || 0) + 1;
      typeCounts[c.verificationType] = (typeCounts[c.verificationType] || 0) + 1;
      companyCounts[c.company] = (companyCounts[c.company] || 0) + 1;
    });

    // Generate monthly growth data for last 12 months
    const monthlyGrowth = this.generateMonthlyGrowth(cases);

    return {
      total: cases.length,
      byStatus: statusCounts,
      byRiskLevel: riskCounts,
      byVerificationType: typeCounts,
      byCompany: companyCounts,
      monthlyGrowth,
    };
  }

  private generateMonthlyGrowth(cases: VerificationCase[]): { labels: string[]; values: number[]; completedValues: number[] } {
    const now = new Date();
    const labels: string[] = [];
    const values: number[] = [];
    const completedValues: number[] = [];

    for (let i = 11; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = month.toLocaleString('en-US', { month: 'short' });
      const monthStart = month.getTime();
      const monthEnd = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59).getTime();

      const created = cases.filter(c => {
        const t = new Date(c.createdAt).getTime();
        return t >= monthStart && t <= monthEnd;
      }).length;

      const completed = cases.filter(c => {
        const t = new Date(c.completedAt || '').getTime();
        return c.completedAt && t >= monthStart && t <= monthEnd;
      }).length;

      labels.push(monthLabel);
      values.push(created);
      completedValues.push(completed);
    }

    return { labels, values, completedValues };
  }
}
