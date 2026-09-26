export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  employeeId: number;
  fullName: string;
  role: string;
}
