import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DatabaseService } from './database.service';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { NotificationType, NotificationPriority } from '../models/notification.model';
import { AuditAction } from '../models/audit.model';

// Indian enterprise name pools for realistic data
const INDIAN_FIRST_NAMES = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Krishna',
  'Ishaan', 'Shaurya', 'Ananya', 'Diya', 'Myra', 'Sara', 'Aadhya', 'Isha',
  'Kiara', 'Riya', 'Priya', 'Anika', 'Neha', 'Pooja', 'Rahul', 'Amit',
  'Vikram', 'Rohan', 'Deepak', 'Sanjay', 'Rajesh', 'Suresh', 'Manish', 'Arun',
  'Kavita', 'Sunita', 'Meera', 'Lakshmi', 'Divya', 'Shreya', 'Nisha', 'Pallavi',
];

const INDIAN_LAST_NAMES = [
  'Sharma', 'Patel', 'Kumar', 'Singh', 'Agarwal', 'Gupta', 'Reddy', 'Nair',
  'Joshi', 'Verma', 'Mehta', 'Rao', 'Das', 'Iyer', 'Chopra', 'Malhotra',
  'Bhat', 'Shetty', 'Pillai', 'Menon', 'Mukherjee', 'Banerjee', 'Chatterjee',
  'Desai', 'Kulkarni', 'Hegde', 'Naidu', 'Varma', 'Bhatia', 'Chauhan',
];

const ENTERPRISE_DEPARTMENTS = [
  'Human Resources', 'Engineering', 'Compliance', 'Operations', 'Finance',
  'Legal', 'Quality Assurance', 'Data Analytics', 'Product', 'Security',
];

const INDIAN_COMPANIES = [
  'Tata Consultancy Services', 'Infosys Limited', 'Wipro Technologies',
  'HCL Technologies', 'Tech Mahindra', 'Bharti Airtel', 'Reliance Industries',
  'ICICI Bank', 'HDFC Bank', 'Mahindra Group', 'Larsen & Toubro',
  'Bajaj Finserv', 'Godrej Industries', 'Adani Group', 'Redington India',
  'Mphasis Limited', 'Mindtree Ltd', 'Zoho Corporation', 'Freshworks Inc',
  'Razorpay Software',
];

const GLOBAL_COMPANIES = [
  'Deloitte Consulting', 'Accenture Solutions', 'McKinsey & Company',
  'Goldman Sachs', 'JPMorgan Chase', 'Amazon Web Services',
  'Microsoft Corporation', 'Google LLC', 'Meta Platforms', 'Apple Inc',
  'Salesforce Inc', 'ServiceNow', 'Workday Inc', 'SAP SE',
  'Oracle Corporation', 'IBM Corporation', 'Capgemini SE', 'Cognizant Technology',
];

const VERIFICATION_TYPES = [
  'Employment Verification', 'Education Check', 'Criminal Record Check',
  'Credit History Review', 'Professional Reference', 'Identity Verification',
  'Global Watchlist Screening', 'Address Verification', 'Drug Screening',
  'Social Media Audit',
];

const CASE_STATUSES = ['Pending', 'InProgress', 'Completed', 'Failed', 'OnHold'];
const RISK_LEVELS = ['Low', 'Low', 'Low', 'Medium', 'Medium', 'High', 'Critical'];

const AUDIT_ACTIONS = [
  AuditAction.Login, AuditAction.CreateCase, AuditAction.UpdateCase,
  AuditAction.ViewCase, AuditAction.ViewCases, AuditAction.CreateUser,
  AuditAction.UpdateUser, AuditAction.ToggleUserStatus,
];

const NOTIFICATION_TEMPLATES = [
  { title: 'New verification request assigned', type: NotificationType.Info, priority: NotificationPriority.Medium },
  { title: 'Case status updated to Completed', type: NotificationType.Success, priority: NotificationPriority.Low },
  { title: 'Critical risk detected on case', type: NotificationType.Error, priority: NotificationPriority.Urgent },
  { title: 'Report ready for download', type: NotificationType.Success, priority: NotificationPriority.Low },
  { title: 'User invitation accepted', type: NotificationType.Info, priority: NotificationPriority.Low },
  { title: 'System maintenance scheduled', type: NotificationType.Warning, priority: NotificationPriority.High },
  { title: 'Security alert: unusual login activity', type: NotificationType.Error, priority: NotificationPriority.Urgent },
  { title: 'Pending approval required', type: NotificationType.Warning, priority: NotificationPriority.High },
  { title: 'Data export completed successfully', type: NotificationType.Success, priority: NotificationPriority.Low },
  { title: 'Case escalation: SLA breach warning', type: NotificationType.Warning, priority: NotificationPriority.High },
  { title: 'New team member onboarded', type: NotificationType.Info, priority: NotificationPriority.Medium },
  { title: 'Quarterly compliance report due', type: NotificationType.Warning, priority: NotificationPriority.Medium },
];

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const db = app.get(DatabaseService);

  console.log('🌱 Seeding database with enterprise-grade data...');

  const usersDb = db.getUsers();
  const casesDb = db.getCases();
  const auditDb = db.getAudit();
  const notificationsDb = db.getNotifications();

  // Clear existing data
  usersDb.remove().write();
  casesDb.remove().write();
  auditDb.remove().write();
  notificationsDb.remove().write();

  const salt = await bcrypt.genSalt(10);
  const adminHash = await bcrypt.hash('Admin@123', salt);
  const userHash = await bcrypt.hash('User@123', salt);

  // --- Seed Core Admin & User ---
  const adminId = uuidv4();
  usersDb.push({
    id: adminId,
    email: 'admin@mploychek.com',
    password: adminHash,
    name: 'Rajesh Sharma',
    role: 'admin',
    isActive: true,
    avatar: undefined,
    department: 'Administration',
    createdAt: faker.date.past({ years: 2 }).toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: faker.date.recent({ days: 1 }).toISOString(),
  }).write();

  const officerIds: string[] = [];
  const primaryUserId = uuidv4();
  officerIds.push(primaryUserId);
  usersDb.push({
    id: primaryUserId,
    email: 'user@mploychek.com',
    password: userHash,
    name: 'Priya Patel',
    role: 'user',
    isActive: true,
    avatar: undefined,
    department: 'Operations',
    createdAt: faker.date.past({ years: 1 }).toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: faker.date.recent({ days: 3 }).toISOString(),
  }).write();

  // --- Seed 110+ Users (Indian & Global enterprise mix) ---
  const roles = ['admin', 'user', 'user', 'user', 'user'];
  for (let i = 0; i < 115; i++) {
    const isIndian = Math.random() > 0.35; // 65% Indian names
    const fName = isIndian
      ? faker.helpers.arrayElement(INDIAN_FIRST_NAMES)
      : faker.person.firstName();
    const lName = isIndian
      ? faker.helpers.arrayElement(INDIAN_LAST_NAMES)
      : faker.person.lastName();
    const fullName = `${fName} ${lName}`;
    const id = uuidv4();
    const role = faker.helpers.arrayElement(roles);

    if (role === 'user') officerIds.push(id);

    const provider = faker.helpers.arrayElement(['mploychek.com', 'verifyhub.io', 'checkmate.co']);
    usersDb.push({
      id,
      email: faker.internet.email({ firstName: fName, lastName: lName, provider }).toLowerCase(),
      password: userHash,
      name: fullName,
      role,
      isActive: faker.datatype.boolean({ probability: 0.85 }),
      avatar: undefined,
      department: faker.helpers.arrayElement(ENTERPRISE_DEPARTMENTS),
      createdAt: faker.date.past({ years: 2 }).toISOString(),
      updatedAt: faker.date.recent({ days: 30 }).toISOString(),
      lastLogin: faker.datatype.boolean({ probability: 0.7 })
        ? faker.date.recent({ days: 14 }).toISOString()
        : undefined,
    }).write();
  }

  console.log(`  ✓ Created ${117} users`);

  // --- Seed 260+ Verification Cases ---
  const allCompanyNames = [
    ...INDIAN_COMPANIES,
    ...GLOBAL_COMPANIES,
    ...Array.from({ length: 25 }, () => faker.company.name()),
  ];

  const allPositions = [
    'Software Engineer', 'Senior Developer', 'Product Manager', 'Data Analyst',
    'Operations Manager', 'Financial Analyst', 'HR Business Partner', 'Legal Counsel',
    'Quality Engineer', 'DevOps Engineer', 'Solutions Architect', 'Project Manager',
    'Compliance Officer', 'Security Analyst', 'Marketing Director', 'Sales Lead',
  ];

  for (let i = 0; i < 270; i++) {
    const status = faker.helpers.arrayElement(CASE_STATUSES);
    const createdAt = faker.date.past({ years: 1 });
    const isCompleted = status === 'Completed' || status === 'Failed';
    const updatedAt = faker.date.between({ from: createdAt, to: new Date() });
    const isIndian = Math.random() > 0.35;

    const cFirstName = isIndian
      ? faker.helpers.arrayElement(INDIAN_FIRST_NAMES)
      : faker.person.firstName();
    const cLastName = isIndian
      ? faker.helpers.arrayElement(INDIAN_LAST_NAMES)
      : faker.person.lastName();

    casesDb.push({
      id: uuidv4(),
      caseNumber: `MPC-2024-${String(i + 1).padStart(4, '0')}`,
      candidateName: `${cFirstName} ${cLastName}`,
      candidateEmail: faker.internet.email({ firstName: cFirstName, lastName: cLastName }).toLowerCase(),
      company: faker.helpers.arrayElement(allCompanyNames),
      position: faker.helpers.arrayElement(allPositions),
      verificationType: faker.helpers.arrayElement(VERIFICATION_TYPES),
      status,
      riskLevel: faker.helpers.arrayElement(RISK_LEVELS),
      assignedTo: faker.helpers.arrayElement(officerIds),
      findings: isCompleted ? faker.lorem.paragraph() : '',
      notes: faker.lorem.sentence(),
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString(),
      completedAt: isCompleted ? updatedAt.toISOString() : null,
    }).write();
  }

  console.log('  ✓ Created 270 verification cases');

  // --- Seed 550+ Audit Logs ---
  const auditResources = ['Case', 'User', 'System', 'Report', 'Settings', 'Export', 'Dashboard'];
  const auditDetails: Record<string, string[]> = {
    [AuditAction.Login]: ['Successfully authenticated via SSO', 'Logged in from new device', 'Authenticated via MFA'],
    [AuditAction.CreateCase]: ['Created new verification request', 'Initiated background check', 'Opened employment verification'],
    [AuditAction.UpdateCase]: ['Updated case status', 'Added findings to case', 'Changed risk assessment level'],
    [AuditAction.ViewCase]: ['Viewed case details', 'Downloaded case report', 'Reviewed case findings'],
    [AuditAction.ViewCases]: ['Accessed cases dashboard', 'Exported case list to CSV', 'Filtered cases by status'],
    [AuditAction.CreateUser]: ['Invited new team member', 'Created user account', 'Provisioned access for new hire'],
    [AuditAction.UpdateUser]: ['Updated user permissions', 'Changed user role assignment', 'Modified user profile'],
    [AuditAction.ToggleUserStatus]: ['Deactivated user account', 'Reactivated user account', 'Suspended access pending review'],
  };

  for (let i = 0; i < 560; i++) {
    const action = faker.helpers.arrayElement(AUDIT_ACTIONS);
    const userId = faker.helpers.arrayElement([...officerIds, adminId]);
    const userDetails = auditDetails[action] || ['Performed action'];
    
    auditDb.push({
      id: uuidv4(),
      userId,
      userEmail: faker.internet.email(),
      action,
      resource: faker.helpers.arrayElement(auditResources),
      resourceId: uuidv4(),
      details: faker.helpers.arrayElement(userDetails),
      ipAddress: faker.internet.ip(),
      timestamp: faker.date.recent({ days: 90 }).toISOString(),
    }).write();
  }

  console.log('  ✓ Created 560 audit log entries');

  // --- Seed 65+ Notifications ---
  for (let i = 0; i < 68; i++) {
    const template = faker.helpers.arrayElement(NOTIFICATION_TEMPLATES);
    const hasExpiration = Math.random() > 0.7;
    const createdAt = faker.date.recent({ days: 14 });
    const targetUserId = Math.random() > 0.4 ? faker.helpers.arrayElement([...officerIds, adminId]) : null;

    notificationsDb.push({
      id: uuidv4(),
      userId: targetUserId,
      type: template.type,
      priority: template.priority,
      title: template.title,
      message: faker.lorem.sentence(),
      actionUrl: Math.random() > 0.4 ? `/cases/${uuidv4()}` : undefined,
      actionText: Math.random() > 0.5 ? 'View Details' : undefined,
      isRead: faker.datatype.boolean({ probability: 0.35 }),
      createdAt: createdAt.toISOString(),
      expiresAt: hasExpiration ? faker.date.future({ years: 0.5, refDate: createdAt }).toISOString() : undefined,
    }).write();
  }

  console.log('  ✓ Created 68 notifications');
  console.log('🎉 Seeding complete! Enterprise data generated successfully.');
  await app.close();
}

bootstrap();
