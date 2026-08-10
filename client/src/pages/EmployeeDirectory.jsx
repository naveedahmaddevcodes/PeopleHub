import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import {
  useGetEmployeesQuery,
  useDeleteEmployeeMutation,
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

function EmployeeDirectory() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");

  const {
    data: employees = [],
    isLoading,
    isError,
  } = useGetEmployeesQuery({
    search,
    department,
  });

  const [deleteEmployee, { isLoading: isDeleting }] =
    useDeleteEmployeeMutation();

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    try {
      await deleteEmployee(id).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to delete employee");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Employee Directory
          </h1>
          {isAdmin && (
            <button
              onClick={() => navigate("/employees/new")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              + Add Employee
            </button>
          )}
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name, email, or title..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={department}
            onChange={handleDepartmentChange}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Loading / Error states */}
        {isLoading && (
          <p className="text-gray-600 text-center py-8">Loading employees...</p>
        )}
        {isError && (
          <p className="text-red-600 text-center py-8">
            Failed to load employees. Please try again.
          </p>
        )}

        {/* Employee list */}
        {!isLoading && !isError && employees.length === 0 && (
          <p className="text-gray-600 text-center py-8">No employees found.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map((employee) => (
            <div
              key={employee._id}
              className="bg-white rounded-lg shadow-md p-6 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    employee.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      employee.name,
                    )}&background=0d9488&color=fff`
                  }
                  alt={employee.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {employee.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {employee.title || "No title"}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600 flex-1">
                <p>
                  <span className="font-medium">Email:</span> {employee.email}
                </p>
                <p>
                  <span className="font-medium">Department:</span>{" "}
                  {employee.department || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span>{" "}
                  {employee.phone || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Joined:</span>{" "}
                  {employee.joinDate
                    ? new Date(employee.joinDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>

              {isAdmin && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => navigate(`/employees/${employee._id}/edit`)}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-md text-sm transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(employee._id)}
                    disabled={isDeleting}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm transition disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EmployeeDirectory;
