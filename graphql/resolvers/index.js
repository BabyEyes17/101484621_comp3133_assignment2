const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const Employee = require("../../models/Employee");
const cloudinary = require("../../utils/cloudinary");
const { signupRules, employeeRules, updateEmployeeRules, runValidation } = require("../../utils/validators");



const createToken = (user) => {
    
    const secret = process.env.JWT_SECRET;
    
    if (!secret) return null;

    return jwt.sign(
        
        { sub: user._id.toString(), username: user.username, email: user.email }, secret, { expiresIn: "1d" }
    );
};



const uploadEmployeePhotoIfPresent = async (employee_photo) => {
    
    if (!employee_photo) return null;

    const value = String(employee_photo).trim();
    if (!value) return null;

    const isDataUri = value.startsWith("data:image/");
    const isHttpUrl = /^https?:\/\/.+/i.test(value);

    if (!isDataUri && !isHttpUrl) {
        throw new Error("employee_photo must be a public URL or a base64 data URI (data:image/...)");
    }

    const uploadResult = await cloudinary.uploader.upload(value, {
        folder: "comp3133/employees"
    });

    return uploadResult.secure_url;
};

const resolvers = {
    
    
    
    Query: {
        
        
        
        login: async (_, { input }) => {
            
            const { username, email, password } = input;

            const orFilters = [];
            
            if (username) orFilters.push({ username });

            if (email) orFilters.push({ email });

            if (orFilters.length === 0) {
                return { success: false, message: "Provide username or email", user: null, token: null };
            }

            const user = await User.findOne({ $or: orFilters });

            if (!user) {
                return { success: false, message: "User not found", user: null, token: null };
            }

            const valid = await bcrypt.compare(password, user.password);

            if (!valid) {
                return { success: false, message: "Invalid password", user: null, token: null };
            }

            return {
                success: true,
                message: "Login successful",
                user,
                token: createToken(user)
            };
        },

        getAllEmployees: async () => {
            return await Employee.find().sort({ created_at: -1 });
        },

        searchEmployeeById: async (_, { id }) => {
            return await Employee.findById(id);
        },

        searchEmployeeByDeptOrDesignation: async (_, { department, designation }) => {
            
            const filters = [];

            if (department) filters.push({ department });
            if (designation) filters.push({ designation });
            if (filters.length === 0) return [];

            return await Employee.find({ $or: filters }).sort({ created_at: -1 });
        }
    },



    Mutation: {
        
        
        
        signup: async (_, { input }) => {
            
            const error = await runValidation(signupRules, input);
            
            if (error) {
                return { success:false, message:error };
            }

            const { username, email, password } = input;

            const existing = await User.findOne({
                $or: [{ username }, { email }]
            });

            if (existing) {
                return { success: false, message: "User already exists" };
            }

            const hashed = await bcrypt.hash(password, 10);

            const user = await User.create({
                username,
                email,
                password: hashed
            });

            return { 
                success: true,
                message: "Signup successful",
                user,
                token: createToken(user)
            };
        },



        addEmployee: async (_, { input }) => {
            
            const error = await runValidation(employeeRules, input);
            
            if (error) {
                return { success: false, message: error, employee: null };
            }

            try {
                
                const photoUrl = await uploadEmployeePhotoIfPresent(input.employee_photo);

                const employee = await Employee.create({
                    
                    ...input,
                    employee_photo: photoUrl,
                    date_of_joining: new Date(input.date_of_joining)
                });

                return { success: true, message: "Employee created", employee };
            }

            catch (e) {
                return { success: false, message: e.message || "Failed to create employee", employee: null };
            }
        },


        
        updateEmployeeById: async (_, { id, input }) => {
            
            const error = await runValidation(updateEmployeeRules, input);
            
            if (error) {
                return { success: false, message: error, employee: null };
            }

            try {
                
                const update = { ...input };

                if (update.date_of_joining) {
                    update.date_of_joining = new Date(update.date_of_joining);
                }

                if (Object.prototype.hasOwnProperty.call(update, "employee_photo")) {
                    
                    const uploaded = await uploadEmployeePhotoIfPresent(update.employee_photo);

                    update.employee_photo = uploaded;
                }

                const updated = await Employee.findByIdAndUpdate(id, update, { new: true });
                
                if (!updated) {
                    return { success: false, message: "Employee not found", employee: null };
                }

                return { success: true, message: "Employee updated", employee: updated };
            } 
            
            catch (e) {
                return { success: false, message: e.message || "Failed to update employee", employee: null };
            }
        },


        
        deleteEmployeeById: async (_, { id }) => {
            
            try {
                
                const deleted = await Employee.findByIdAndDelete(id);
                
                if (!deleted) {
                    return { success: false, message: "Employee not found", employee: null };
                }

                return { success: true, message: "Employee deleted", employee: deleted };
            } 
            
            catch (e) {
                return { success: false, message: e.message || "Failed to delete employee", employee: null };
            }
        },
    },



    Employee: {
        
        date_of_joining: (employee) => employee.date_of_joining ? employee.date_of_joining.toISOString() : null,
        
        created_at: (employee) => employee.created_at ? employee.created_at.toISOString() : null,
        
        updated_at: (employee) => employee.updated_at ? employee.updated_at.toISOString() : null,
    },



    User: {
        
        created_at: (user) => (user.created_at ? user.created_at.toISOString() : null),
        
        updated_at: (user) => (user.updated_at ? user.updated_at.toISOString() : null),
    }
};



module.exports = resolvers;
