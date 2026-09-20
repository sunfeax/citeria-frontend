import { eUserType } from './user-type';
import { iUser } from './user';

export interface iRegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  type: eUserType;
}

export type tRegisterResponse = iUser;
