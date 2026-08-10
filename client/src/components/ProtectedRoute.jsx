import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshMutation } from "../redux/api/authApi";
import { setCredentials, clearCredentials } from "../redux/slices/authSlice";

// Guards routes: ensures the user is authenticated.
// On first load (no in-memory token), it attempts a silent refresh via the httpOnly cookie.
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  const [refresh, { isLoading: isRefreshing }] = useRefreshMutation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Attempt a silent refresh only if not authenticated and not already loading
    if (!isAuthenticated && !isLoading) {
      refresh()
        .unwrap()
        .then((data) => {
          const { accessToken, ...user } = data;
          dispatch(setCredentials({ user, accessToken }));
        })
        .catch(() => {
          dispatch(clearCredentials());
        });
    }
  }, [isAuthenticated, isLoading, refresh, dispatch]);

  if (isLoading || isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
