# PeopleHub - Phase 3: Employee Directory Feature

## Backend

- [x] 1. `server/utils/cloudinary.js` - Cloudinary config
- [x] 2. `server/middleware/uploadMiddleware.js` - Multer memory storage for photo upload
- [x] 3. `server/controllers/employeeController.js` - CRUD controllers with search + dept filter
- [x] 4. `server/routes/employeeRoutes.js` - Routes with protect + authorize("admin") on writes
- [x] 5. `server/server.js` - Mount employee routes
- [x] 6. `.env` - Add Cloudinary placeholders (via PowerShell Add-Content)

## Frontend

- [x] 7. `client/src/redux/api/employeeApi.js` - RTK Query API
- [x] 8. `client/src/redux/store.js` - Register employeeApi
- [x] 9. `client/src/pages/EmployeeDirectory.jsx` - Directory page with search + filter
- [x] 10. `client/src/pages/EmployeeForm.jsx` - Add/Edit form with photo upload (admin only)
- [x] 11. `client/src/App.jsx` - Add routes
- [x] 12. `client/src/components/Navbar.jsx` - Add Employees link

## Verification

- [x] Server boots successfully (port 5000, MongoDB connected)
- [x] Client builds successfully (Vite production build, dist/ created)
