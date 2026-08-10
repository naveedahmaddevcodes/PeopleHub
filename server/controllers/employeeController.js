import User from "../models/User.js";
import cloudinary from "../utils/cloudinary.js";

// Helper to upload a buffer to Cloudinary and return the secure URL
const uploadToCloudinary = async (file) => {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "peoplehub/employees", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
    stream.end(file.buffer);
  });
  return result.secure_url;
};

// @desc    Get all employees (with optional search + department filter)
// @route   GET /api/employees
// @access  Private (any logged-in user)
export const getEmployees = async (req, res) => {
  try {
    const { search = "", department = "" } = req.query;

    // Build filter object
    const filter = {};

    if (department && department !== "All") {
      filter.department = department;
    }

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { email: regex }, { title: regex }];
    }

    const employees = await User.find(filter)
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get single employee by id
// @route   GET /api/employees/:id
// @access  Private (any logged-in user)
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id).select("-passwordHash");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private (admin only)
export const createEmployee = async (req, res) => {
  try {
    const { name, email, department, title, phone, address, joinDate, role } =
      req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "Please provide at least name and email" });
    }

    // Check if employee already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Employee already exists" });
    }

    // Upload profile photo if provided
    let profilePhoto = null;
    if (req.file) {
      profilePhoto = await uploadToCloudinary(req.file);
    }

    const employee = await User.create({
      name,
      email,
      passwordHash: null, // Employees created by admin have no password yet
      department: department || null,
      title: title || null,
      phone: phone || null,
      address: address || null,
      joinDate: joinDate || Date.now(),
      role: role || "employee",
      profilePhoto,
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Update an employee
// @route   PUT /api/employees/:id
// @access  Private (admin only)
export const updateEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const { name, email, department, title, phone, address, joinDate, role } =
      req.body;

    // Upload profile photo if a new one is provided
    let profilePhoto = employee.profilePhoto;
    if (req.file) {
      profilePhoto = await uploadToCloudinary(req.file);
    }

    employee.name = name || employee.name;
    employee.email = email || employee.email;
    employee.department = department ?? employee.department;
    employee.title = title ?? employee.title;
    employee.phone = phone ?? employee.phone;
    employee.address = address ?? employee.address;
    employee.joinDate = joinDate || employee.joinDate;
    employee.role = role || employee.role;
    employee.profilePhoto = profilePhoto;

    const updatedEmployee = await employee.save();

    res.json(updatedEmployee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private (admin only)
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await User.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await employee.deleteOne();
    res.json({ message: "Employee removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
