import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  CreateCategoryController,
  updateCategoryController,
  createController,
  getSingleController,
  DeleteCategoryController,
} from "../controllers/CategoryController.js";

const router = express.Router();

//ROUTER

router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  CreateCategoryController
);

// Updated Category
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

//getAll Category
router.get("/get-category", createController);

// single Category
router.get("/single-category/:slug", getSingleController);

// delete category Route
router.delete("/delete-category/:id",requireSignIn,isAdmin, DeleteCategoryController);

export default router;
