import express from "express";
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employeeController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Read operations - any logged-in user
router.route("/").get(getEmployees);
router.route("/:id").get(getEmployeeById);

// Write operations - admin only
router
  .route("/")
  .post(authorize("admin"), upload.single("profilePhoto"), createEmployee);
router
  .route("/:id")
  .put(authorize("admin"), upload.single("profilePhoto"), updateEmployee)
  .delete(authorize("admin"), deleteEmployee);

export default router;
