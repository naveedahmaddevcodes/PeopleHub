import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import {
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useGetEmployeeByIdQuery,
} from "../redux/api/employeeApi";

const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Marketing",
  "Sales",
  "Finance",
  "Operations",
  "Design",
  "Customer Support",
];

const ROLES = ["employee", "manager", "admin"];

function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  // For edit mode, fetch existing employee data
  const { data: existingEmployee, isLoading: isLoadingEmployee } =
    useGetEmployeeByIdQuery(id, { skip: !isEdit });

  const [createEmployee, { isLoading: isCreating }] =
    useCreateEmployeeMutation();
  const [updateEmployee, { isLoading: isUpdating }] =
    useUpdateEmployeeMutation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    title: "",
    phone: "",
    address: "",
    joinDate: "",
    role: "employee",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (existingEmployee) {
      setFormData({
        name: existingEmployee.name || "",
        email: existingEmployee.email || "",
        department: existingEmployee.department || "",
        title: existingEmployee.title || "",
        phone: existingEmployee.phone || "",
        address: existingEmployee.address || "",
        joinDate: existingEmployee.joinDate
          ? new Date(existingEmployee.joinDate).toISOString().split("T")[0]
          : "",
        role: existingEmployee.role || "employee",
      });
    }
  }, [existingEmployee]);

  // Guard: only admins can access this form
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="p-8 text-center">
          <p className="text-red-600 font-semibold">
            Access denied. Only admins can add or edit employees.
          </p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email) {
      setError("Name and email are required.");
      return;
    }

    // Build FormData for multipart upload (supports photo upload)
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("department", formData.department);
    data.append("title", formData.title);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("joinDate", formData.joinDate);
    data.append("role", formData.role);
    if (profilePhoto) {
      data.append("profilePhoto", profilePhoto);
    }

    try {
      if (isEdit) {
        await updateEmployee({ id, formData: data }).unwrap();
      } else {
        await createEmployee(data).unwrap();
      }
      navigate("/employees");
    } catch (err) {
      setError(err?.data?.message || "Failed to save employee.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEdit ? "Edit Employee" : "Add Employee"}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {isLoadingEmployee ? (
          <p className="text-gray-600">Loading employee data...</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select department</option>
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Join Date
                  </label>
                  <input
                    type="date"
                    name="joinDate"
                    value={formData.joinDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {isEdit && existingEmployee?.profilePhoto && (
                    <p className="text-xs text-gray-500 mt-1">
                      Current photo uploaded. Select a new file to replace it.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition disabled:opacity-50"
                >
                  {isCreating || isUpdating
                    ? "Saving..."
                    : isEdit
                      ? "Update Employee"
                      : "Add Employee"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/employees")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EmployeeForm;
