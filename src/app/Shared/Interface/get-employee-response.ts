export interface GetEmployeeResponse {
    employeeId: number;
    fullName: string;
    email: string;
    birthDate: Date;
    positionId: number;
    position: string;
}


export interface GetEmployeeListResponse {
  employees: GetEmployeeResponse[];
}
