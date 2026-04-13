export interface Employee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender?: string;
  designation: string;
  salary: number;
  department: string;
  employee_photo?: string;
  date_of_joining: string;
  created_at?: string;
  updated_at?: string;
}

export interface EmployeeResponse {
  success: boolean;
  message: string;
  employee?: Employee;
}
