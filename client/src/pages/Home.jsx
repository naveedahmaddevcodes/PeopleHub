import React from "react";
import { useSelector } from "react-redux";
import Navbar from "../components/Navbar";

function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome, {user?.name}!
        </h1>
        <div className="bg-white rounded-lg shadow-md p-6 max-w-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Your Profile
          </h2>
          <div className="space-y-2 text-gray-600">
            <p>
              <span className="font-medium">Email:</span> {user?.email}
            </p>
            <p>
              <span className="font-medium">Role:</span>{" "}
              <span className="capitalize">{user?.role}</span>
            </p>
            <p>
              <span className="font-medium">Department:</span>{" "}
              {user?.department || "N/A"}
            </p>
            <p>
              <span className="font-medium">Join Date:</span>{" "}
              {user?.joinDate
                ? new Date(user.joinDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
