export enum AuditAction {
  Login = 'Login',
  Logout = 'Logout',
  CreateUser = 'CreateUser',
  UpdateUser = 'UpdateUser',
  DeleteUser = 'DeleteUser',
  ToggleUserStatus = 'ToggleUserStatus',
  CreateCase = 'CreateCase',
  UpdateCase = 'UpdateCase',
  DeleteCase = 'DeleteCase',
  ViewCase = 'ViewCase',
  ViewCases = 'ViewCases',
}

export interface AuditEntry {
  id: string;
  userId: string;
  userEmail: string;
  action: AuditAction;
  resource: string;
  resourceId: string | null;
  details: string;
  ipAddress: string;
  timestamp: string;
}
