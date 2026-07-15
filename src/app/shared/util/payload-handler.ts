import { iRegisterRequest } from '../../features/auth/models/register';
import { iUserUpdateRequest } from '../../features/profile/models/user-update-request';

export function getRegisterPayload(raw: iRegisterRequest) {
  return {
    firstName: raw.firstName.trim(),
    lastName: raw.lastName.trim(),
    email: raw.email.trim(),
    phone: raw.phone.trim(),
    password: raw.password,
    type: raw.type,
  };
}

export function getUserUpdatePayload(raw: iUserUpdateRequest) {
  return {
    firstName: raw.firstName?.trim(),
    lastName: raw.lastName?.trim(),
    email: raw.email?.trim(),
    phone: raw.phone?.trim(),
  };
}
