import { UserType } from './user-type.enum';
import { UserRole } from './user-role.enum';

export interface LoginRequest {
  email: string,
  password: string
}

export interface LoginResponse {
  token: string,
  tokenType: string,
  user: {
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
}