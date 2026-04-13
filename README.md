# Employee Management System

## Overview
This project is a GraphQL-based application using Angular and GraphQL. Functionality of this application includes user signup, login, and employee CRUD operations including image upload. The UI/UX is friendly, intuitive, and easy to navigate.

## Developer
Jayden Lewis<br>
Student ID: 101484621<br>

## Deployed Sites Via Vercel
- Frontend: https://101484621-comp3133-assignment2-fron.vercel.app
- Backend: https://101484621-comp3133-assignment2-back.vercel.app/graphql

## Validation Rules

### User Signup
- `username` is required and must be unique.
- `email` is required and must be unique.
- `password` is required and stored in encrypted (hashed) form.

### Employee Creation / Update
- `first_name` is required.
- `last_name` is required.
- `email` must be unique.
- `gender` must be one of: `Male`, `Female`, or `Other`.
- `designation` is required.
- `salary` is required and must be greater than or equal to 1000.
- `date_of_joining` is required and must be a valid date.
- `department` is required.
- `employee_photo` stores the image URL/path (uploaded via Cloudinary).

### Authentication
- Users can log in using either username or email along with their password.

### Search
- Employees can be searched by:
    - Employee ID
    - Designation
    - Department
- Searching by designation or department accepts either field (or both).

## Local Project Setup

### Clone the repository
```bash
git clone https://github.com/BabyEyes17/101484621_comp3133_assignment2
cd 101484621_comp3133_assignment2/
```

### Install required dependencies
```bash
cd backend/
npm install
cd ../frontend/
npm install
```

### Create a .env file in the backend directory with the following environment variables
```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Running The Project

### Start the frontend
```bash
ng serve
```

### Start the backend
```bash
cd ../backend/
node server.js
```
