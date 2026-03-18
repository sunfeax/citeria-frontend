import { UserType } from "../../../core/enums/userType"

export interface IRegisterRequest {
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string
  type: UserType
}