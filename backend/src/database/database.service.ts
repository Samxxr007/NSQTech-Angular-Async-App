import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { User } from '../models/user.model';
import { VerificationCase } from '../models/case.model';
import { AuditEntry } from '../models/audit.model';
import { Notification } from '../models/notification.model';

/* eslint-disable @typescript-eslint/no-var-requires */
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

export interface DatabaseSchema {
  users: User[];
  cases: VerificationCase[];
  audit: AuditEntry[];
  notifications: Notification[];
}

@Injectable()
export class DatabaseService implements OnModuleInit {
  private readonly logger = new Logger(DatabaseService.name);
  private db: any;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    const adapter = new FileSync(this.configService.dbPath);
    this.db = low(adapter);
    this.db
      .defaults({ users: [], cases: [], audit: [], notifications: [] })
      .write();

    this.db.set('users', [
      {
        id: '1',
        name: 'Admin User',
        email: 'admin@mploychek.com',
        password: 'Admin@123',
        role: 'admin',
        isActive: true
      },
      {
        id: '2',
        name: 'Verification Officer',
        email: 'user@mploychek.com',
        password: 'User@123',
        role: 'user',
        isActive: true
      }
    ]).write();
    this.logger.log('Users force reset on startup');

    this.logger.log(`Database initialized at ${this.configService.dbPath}`);
  }

  getUsers(): any {
    return this.db.get('users');
  }

  getCases(): any {
    return this.db.get('cases');
  }

  getAudit(): any {
    return this.db.get('audit');
  }

  getNotifications(): any {
    return this.db.get('notifications');
  }

  /** Direct access to the lowdb instance for advanced queries */
  getDb(): any {
    return this.db;
  }
}
