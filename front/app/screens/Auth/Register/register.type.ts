export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export type RegisterResponse = {
  token: string
  user: {
    id: string
    email: string
    role: string
  }
};
export interface RegisterApiErrors extends Error {
  status: number
  data: {
    message: string
  }
}
