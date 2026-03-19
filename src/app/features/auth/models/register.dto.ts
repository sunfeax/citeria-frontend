import { UserRole } from "./user-role.enum";
import { UserType } from "./user-type.enum"

export interface RegisterRequest {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  type: UserType
}

export interface RegisterResponse {
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

export type RegisterServerErrors = Partial<Record<
  'firstName'
  | 'lastName'
  | 'email'
  | 'phone'
  | 'password'
  | 'confirmPassword'
  | 'type',
  string
>>;