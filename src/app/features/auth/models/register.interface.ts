import { UserType } from "../../../core/enums/userType"

export interface IRegisterRequest {
  firstName: string,
  lastName: string,
  email: string,
  phone: string | null,
  password: string
  type: UserType
}