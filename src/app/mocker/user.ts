export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  roleId: string;
  role: string;
  token?: string;
}
