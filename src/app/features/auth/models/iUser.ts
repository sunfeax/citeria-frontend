import { eUserRole } from './eUserRole';
import { eUserType } from './eUserType';

export interface iUser {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: eUserRole;
  type: eUserType;
  isActive: boolean;
  createdAt: string;
}
