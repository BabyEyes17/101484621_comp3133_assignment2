require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



// Models
const User = mongoose.model("User", new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }));

const Employee = mongoose.model("Employee", new mongoose.Schema({
  first_name:      { type: String, required: true },
  last_name:       { type: String, required: true },
  email:           { type: String, required: true, unique: true },
  gender:          { type: String, enum: ["Male", "Female", "Other"] },
  designation:     { type: String, required: true },
  salary:          { type: Number, required: true, min: 1000 },
  date_of_joining: { type: Date,   required: true },
  department:      { type: String, required: true },
  employee_photo:  { type: String }
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }));



// Seed Data
const employees = [
  { first_name: "Alice",   last_name: "Johnson",   email: "alice.johnson@company.com",   gender: "Female", designation: "Frontend Developer",      salary: 72000, date_of_joining: "2022-03-15", department: "Engineering" },
  { first_name: "Bob",     last_name: "Martinez",  email: "bob.martinez@company.com",    gender: "Male",   designation: "Backend Developer",       salary: 78000, date_of_joining: "2021-07-01", department: "Engineering" },
  { first_name: "Carol",   last_name: "Smith",     email: "carol.smith@company.com",     gender: "Female", designation: "Product Manager",         salary: 95000, date_of_joining: "2020-01-20", department: "Product" },
  { first_name: "David",   last_name: "Lee",       email: "david.lee@company.com",       gender: "Male",   designation: "UX Designer",             salary: 68000, date_of_joining: "2023-02-10", department: "Design" },
  { first_name: "Emma",    last_name: "Wilson",    email: "emma.wilson@company.com",     gender: "Female", designation: "QA Engineer",             salary: 65000, date_of_joining: "2022-09-05", department: "Quality Assurance" },
  { first_name: "Frank",   last_name: "Brown",     email: "frank.brown@company.com",     gender: "Male",   designation: "DevOps Engineer",         salary: 88000, date_of_joining: "2021-04-18", department: "Infrastructure" },
  { first_name: "Grace",   last_name: "Taylor",    email: "grace.taylor@company.com",    gender: "Female", designation: "Data Scientist",          salary: 92000, date_of_joining: "2020-11-30", department: "Data" },
  { first_name: "Henry",   last_name: "Anderson",  email: "henry.anderson@company.com",  gender: "Male",   designation: "Full Stack Developer",    salary: 82000, date_of_joining: "2022-06-22", department: "Engineering" },
  { first_name: "Isla",    last_name: "Thomas",    email: "isla.thomas@company.com",     gender: "Female", designation: "HR Manager",              salary: 70000, date_of_joining: "2019-08-14", department: "Human Resources" },
  { first_name: "James",   last_name: "Garcia",    email: "james.garcia@company.com",    gender: "Male",   designation: "Security Engineer",       salary: 91000, date_of_joining: "2021-12-01", department: "Security" },
  { first_name: "Karen",   last_name: "White",     email: "karen.white@company.com",     gender: "Female", designation: "Marketing Specialist",    salary: 62000, date_of_joining: "2023-05-17", department: "Marketing" },
  { first_name: "Liam",    last_name: "Harris",    email: "liam.harris@company.com",     gender: "Male",   designation: "Mobile Developer",        salary: 76000, date_of_joining: "2022-01-09", department: "Engineering" },
];

const testUser = {
  username: "user",
  email:    "user@gmail.com",
  password: "password"
};



// Main
async function seed() {
  
    const uri = process.env.MONGO_URI;
  
    if (!uri) { console.error("MONGO_URI missing from .env"); process.exit(1); }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri);
    console.log("Connected.\n");

    // User
    const existing = await User.findOne({ username: testUser.username });
    if (existing) {
        
        console.log(`Test user "${testUser.username}" already exists — skipping.`);
    } 
    
    else {
        
        const hashed = await bcrypt.hash(testUser.password, 10);
        await User.create({ ...testUser, password: hashed });
        console.log(`👤  Created test user: ${testUser.username} / ${testUser.password}`);
    }

    // Employees
    let added = 0, skipped = 0;
    
    for (const emp of employees) {
        
        const exists = await Employee.findOne({ email: emp.email });
        if (exists) { skipped++; continue; }
        await Employee.create({ ...emp, date_of_joining: new Date(emp.date_of_joining) });
        added++;
    }

    console.log(`\nEmployees: ${added} added, ${skipped} already existed.`);
    console.log("\nSeed complete");
    await mongoose.disconnect();
}

seed().catch(err => { console.error("Seed failed:", err.message); process.exit(1); });
