import { UserRole } from './user-role.enum';
import { UserType } from './user-type.enum';

export interface User {
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  role: UserRole,
  type: UserType,
  isActive: boolean,
  createdAt: string
}
