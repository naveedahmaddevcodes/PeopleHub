import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useLogoutMutation } from "../redux/api/authApi";
import { clearCredentials } from "../redux/slices/authSlice";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (err) {
      // ignore errors, clear local state regardless
    }
    dispatch(clearCredentials());
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex items-center justify-between shadow-md">
      <div className="text-xl font-bold">
        <Link to="/">PeopleHub</Link>
      </div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <Link
              to="/employees"
              className="text-sm hover:text-blue-200 transition"
            >
              Employees
            </Link>
            <span className="text-sm">
              {user.name} ({user.role})
            </span>
            <span className="text-sm text-blue-200">{user.department}</span>
          </>
        )}
        <button
          onClick={handleLogout}
          className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md text-sm transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
