export interface ICreateUserData {
  username: string;
  email: string;
  password: string;
  fullName?: string;
  role?: string;
}

export interface IUpdateUserData {
  email?: string;
  fullName?: string;
  isActive?: boolean;
  password?: string;
}

export interface IUserSearchParams {
  username?: string;
  email?: string;
  page?: number;
  limit?: number;
}
