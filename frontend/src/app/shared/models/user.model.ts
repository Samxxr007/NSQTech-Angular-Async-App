export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  isActive: boolean;
  avatar?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}
