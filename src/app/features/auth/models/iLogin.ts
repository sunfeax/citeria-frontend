import { iUser } from './iUser';

export interface iLoginRequest {
  email: string;
  password: string;
}

export interface iLoginResponse {
  token: string;
  tokenType: string;
  user: iUser;
}
