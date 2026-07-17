export interface iChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export type tChangePasswordServerErrors = Partial<
  Record<'currentPassword' | 'newPassword', string>
>;
