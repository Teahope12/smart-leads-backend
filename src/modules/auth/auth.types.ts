export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'Admin' | 'Sales User';
  createdAt: Date;
  updatedAt: Date;
}

export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  role?: 'Admin' | 'Sales User';
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface IRegisterResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}