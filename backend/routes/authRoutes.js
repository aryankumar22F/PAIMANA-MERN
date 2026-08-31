import express from "express";
import { registerUser, loginUser, getProfile, logoutController } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post('/logout',logoutController);
router.get("/me", protect, getProfile);

export default router;
