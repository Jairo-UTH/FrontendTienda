export interface UpdateEmployeeRequest {
  employeeId: number;
  fullName: string;
  email: string;
  birthDate: string;
  positionId: number;
  password?: string;
}
