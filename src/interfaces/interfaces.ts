import { Role } from 'src/constants/role.enum';

export interface JwtPayload {
  sub: number;
  email: string;
  role: Role;
  arcadeId: number;
}

export interface ActiveUserInterface extends JwtPayload {
  userId: number;
}
