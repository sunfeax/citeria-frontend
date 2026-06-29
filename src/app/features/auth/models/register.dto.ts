import { UserType } from "./user-type.enum"
import { User } from "./user.model";

export interface RegisterRequest {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string,
  type: UserType
}

export type RegisterResponse = User;

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