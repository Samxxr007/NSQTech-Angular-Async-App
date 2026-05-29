export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string | null;
  details: string;
  ipAddress: string;
  timestamp: string;
}
