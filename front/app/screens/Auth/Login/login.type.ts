export interface LoginForm {
  email: string
  password: string
}

export type LoginResponse = {
  token: string
  user: {
    id: string
    email: string
    role: string
  }
};
