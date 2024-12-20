import { User } from '../../models/user.model';

export interface LoginResponse {
  user: User;
  token: string;
}

export interface LoginResponseByDecodedJwt {
  user: User;
  exp: number;
}
