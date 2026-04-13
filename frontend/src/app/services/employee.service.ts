import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable, map } from 'rxjs';
import {
  GET_ALL_EMPLOYEES, SEARCH_EMPLOYEE_BY_ID, SEARCH_BY_DEPT_OR_DESIGNATION,
  ADD_EMPLOYEE, UPDATE_EMPLOYEE, DELETE_EMPLOYEE
} from '../graphql/queries';
import { Employee, EmployeeResponse } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.apollo.query<{ getAllEmployees: Employee[] }>({
      query: GET_ALL_EMPLOYEES, fetchPolicy: 'network-only'
    }).pipe(map(r => r.data!.getAllEmployees));
  }

  searchById(id: string): Observable<Employee> {
    return this.apollo.query<{ searchEmployeeById: Employee }>({
      query: SEARCH_EMPLOYEE_BY_ID, variables: { id }, fetchPolicy: 'network-only'
    }).pipe(map(r => r.data!.searchEmployeeById));
  }

  searchByDeptOrDesignation(department?: string, designation?: string): Observable<Employee[]> {
    return this.apollo.query<{ searchEmployeeByDeptOrDesignation: Employee[] }>({
      query: SEARCH_BY_DEPT_OR_DESIGNATION,
      variables: { department, designation },
      fetchPolicy: 'network-only'
    }).pipe(map(r => r.data!.searchEmployeeByDeptOrDesignation));
  }

  addEmployee(input: any): Observable<EmployeeResponse> {
    return this.apollo.mutate<{ addEmployee: EmployeeResponse }>({
      mutation: ADD_EMPLOYEE, variables: { input }
    }).pipe(map(r => r.data!.addEmployee));
  }

  updateEmployee(id: string, input: any): Observable<EmployeeResponse> {
    return this.apollo.mutate<{ updateEmployeeById: EmployeeResponse }>({
      mutation: UPDATE_EMPLOYEE, variables: { id, input }
    }).pipe(map(r => r.data!.updateEmployeeById));
  }

  deleteEmployee(id: string): Observable<EmployeeResponse> {
    return this.apollo.mutate<{ deleteEmployeeById: EmployeeResponse }>({
      mutation: DELETE_EMPLOYEE, variables: { id }
    }).pipe(map(r => r.data!.deleteEmployeeById));
  }
}
