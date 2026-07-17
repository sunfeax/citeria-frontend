export interface iUserUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export type tUserUpdateServerErrors = Partial<
  Record<'firstName' | 'lastName' | 'email' | 'phone', string>
>;
