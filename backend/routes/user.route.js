import express from "express";
import {
  login,
  logout,
  register,
  toggleSavedJob,
  updateProfile,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { profileAndResumeUpload, singleUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/saved-jobs/:jobId").post(isAuthenticated, toggleSavedJob);
router
  .route("/profile/update")
  .post(isAuthenticated, profileAndResumeUpload, updateProfile);

export default router;
