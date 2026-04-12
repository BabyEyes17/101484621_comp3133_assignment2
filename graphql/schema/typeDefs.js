const { gql } = require("apollo-server-express");

const typeDefs = gql`



    type User {
        
        _id: ID!
        username: String!
        email: String!
        created_at: String
        updated_at: String
    }



    type Employee {
        
        _id: ID!
        first_name: String!
        last_name: String!
        email: String!
        gender: String
        designation: String!
        salary: Float!
        department: String!
        employee_photo: String
        date_of_joining: String
        created_at: String
        updated_at: String
    }



    input SignupInput {
        
        username: String!
        email: String!
        password: String!
    }



    input LoginInput {
        
        username: String
        email: String
        password: String!
    }



    input AddEmployeeInput {
        
        first_name: String!
        last_name: String!
        email: String!
        gender: String
        designation: String!
        salary: Float!
        department: String!
        employee_photo: String
        date_of_joining: String!
    }



    input UpdateEmployeeInput {
        
        first_name: String
        last_name: String
        email: String
        gender: String
        designation: String
        salary: Float
        department: String
        employee_photo: String
        date_of_joining: String
    }



    type AuthResponse {
        
        success: Boolean!
        message: String
        user: User
        token: String
    }



    type EmployeeResponse {

        success: Boolean!
        message: String!
        employee: Employee
    }



    type EmployeeListResponse {
    
        success: Boolean!
        message: String!
        employees: [Employee!]!
    }



    type Query {
        
        login(input: LoginInput!): AuthResponse

        getAllEmployees: [Employee]

        searchEmployeeById(id: ID!): Employee

        searchEmployeeByDeptOrDesignation(
            department: String
            designation: String
        ): [Employee]
    }


    
    type Mutation {
        
        signup(input: SignupInput!): AuthResponse

        addEmployee(input: AddEmployeeInput!): EmployeeResponse!

        updateEmployeeById(id: ID!, input: UpdateEmployeeInput!): EmployeeResponse!

        deleteEmployeeById(id: ID!): EmployeeResponse!
    }
`;

module.exports = typeDefs;
