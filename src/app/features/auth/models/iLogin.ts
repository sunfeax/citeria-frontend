import { iUser } from './iUser';

export interface iLoginRequest {
  email: string;
  password: string;
}

export interface iLoginResponse {
  accessToken: string;
  tokenType: string;
  user: iUser;
}
