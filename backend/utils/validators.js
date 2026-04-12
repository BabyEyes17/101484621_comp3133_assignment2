const { body, validationResult } = require("express-validator");



const signupRules = [
    
    body("username").notEmpty().withMessage("Username required"),

    body("email").isEmail().withMessage("Valid email required"),

    body("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars")
];



const employeeRules = [
    
    body("first_name").notEmpty().withMessage("First name required"),

    body("last_name").notEmpty().withMessage("Last name required"),

    body("email").isEmail().withMessage("Valid email required"),

    body("salary").isFloat({ min: 1000 }).withMessage("Salary must be ≥ 1000"),

    body("gender").optional().isIn(["Male", "Female", "Other"]).withMessage("Gender must be Male, Female, or Other"),

    body("designation").notEmpty().withMessage("Designation required"),

    body("date_of_joining").isISO8601().withMessage("Date of joining mus be a valid ISO date (YYYY-MM-DD)"),

    body("department").notEmpty().withMessage("Department required")
];



const updateEmployeeRules = [
    
    body("first_name").optional().notEmpty().withMessage("First name required"),

    body("last_name").optional().notEmpty().withMessage("Last name required"),

    body("email").optional().isEmail().withMessage("Valid email required"),

    body("salary").optional().isFloat({ min: 1000 }).withMessage("Salary must be ≥ 1000"),

    body("gender").optional().isIn(["Male", "Female", "Other"]).withMessage("Gender must be Male, Female, or Other"),

    body("designation").optional().notEmpty().withMessage("Designation required"),

    body("date_of_joining").optional().isISO8601().withMessage("Date of joining mus be a valid ISO date (YYYY-MM-DD)"),

    body("department").optional().notEmpty().withMessage("Department required")
];



const runValidation = async (rules, data) => {
    
    for (let rule of rules) {
        await rule.run({ body: data });
    }

    const errors = validationResult({ body: data });

    if (!errors.isEmpty()) {
        return errors.array().map(e => e.msg).join(", ");
    }

    return null;
};



module.exports = {
    signupRules,
    employeeRules,
    updateEmployeeRules,
    runValidation,
};
