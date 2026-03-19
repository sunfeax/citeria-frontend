import { UserRole } from "./user-role.enum"
import { UserType } from "./user-type.enum"

export interface LoginRequest {
  email: string,
  password: string
}

export interface LoginResponse {
  token: string,
  tokenType: string,
  id: number,
  firstName: string,
  lastName: string,
  role: UserRole,
  type: UserType
}