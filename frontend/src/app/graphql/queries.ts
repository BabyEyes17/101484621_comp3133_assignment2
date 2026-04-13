import { gql } from 'apollo-angular';

export const LOGIN_QUERY = gql`
  query Login($input: LoginInput!) {
    login(input: $input) {
      success
      message
      token
      user { _id username email }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Signup($input: SignupInput!) {
    signup(input: $input) {
      success
      message
      token
      user { _id username email }
    }
  }
`;

export const GET_ALL_EMPLOYEES = gql`
  query GetAllEmployees {
    getAllEmployees {
      _id first_name last_name email gender
      designation salary department employee_photo date_of_joining
    }
  }
`;

export const SEARCH_EMPLOYEE_BY_ID = gql`
  query SearchEmployeeById($id: ID!) {
    searchEmployeeById(id: $id) {
      _id first_name last_name email gender
      designation salary department employee_photo date_of_joining created_at updated_at
    }
  }
`;

export const SEARCH_BY_DEPT_OR_DESIGNATION = gql`
  query SearchEmployeeByDeptOrDesignation($department: String, $designation: String) {
    searchEmployeeByDeptOrDesignation(department: $department, designation: $designation) {
      _id first_name last_name email gender
      designation salary department employee_photo date_of_joining
    }
  }
`;

export const ADD_EMPLOYEE = gql`
  mutation AddEmployee($input: AddEmployeeInput!) {
    addEmployee(input: $input) {
      success message
      employee { _id first_name last_name email designation department }
    }
  }
`;

export const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployeeById($id: ID!, $input: UpdateEmployeeInput!) {
    updateEmployeeById(id: $id, input: $input) {
      success message
      employee {
        _id first_name last_name email gender
        designation salary department employee_photo date_of_joining
      }
    }
  }
`;

export const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployeeById($id: ID!) {
    deleteEmployeeById(id: $id) { success message }
  }
`;
