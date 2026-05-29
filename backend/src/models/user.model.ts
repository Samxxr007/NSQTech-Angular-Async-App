export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export type SafeUser = Omit<User, 'password'>;
