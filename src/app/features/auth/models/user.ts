import { eUserRole } from './user-role';
import { eUserType } from './user-type';

export interface iUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: eUserRole;
  type: eUserType;
  isActive: boolean;
  createdAt: string;
}
