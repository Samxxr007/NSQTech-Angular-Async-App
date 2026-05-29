import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database/database.service';
import { AuditEntry, AuditAction } from '../models/audit.model';

interface LogAuditParams {
  userId: string;
  action: AuditAction;
  resource: string;
  resourceId: string | null;
  details: string;
  ipAddress?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  log(params: LogAuditParams): void {
    const userRecord = this.databaseService
      .getUsers()
      .find({ id: params.userId })
      .value();

    const entry: AuditEntry = {
      id: uuidv4(),
      userId: params.userId,
      userEmail: userRecord?.email || 'unknown',
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      details: params.details,
      ipAddress: params.ipAddress || '127.0.0.1',
      timestamp: new Date().toISOString(),
    };

    this.databaseService.getAudit().push(entry).write();
    this.logger.debug(`Audit: [${entry.action}] ${entry.details} by ${entry.userEmail}`);
  }

  findAll(page: number = 1, limit: number = 20): {
    data: AuditEntry[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } {
    const allEntries: AuditEntry[] = this.databaseService.getAudit().value();

    // Sort by timestamp descending (newest first)
    const sorted = [...allEntries].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    const total = sorted.length;
    const startIndex = (page - 1) * limit;
    const data = sorted.slice(startIndex, startIndex + limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
