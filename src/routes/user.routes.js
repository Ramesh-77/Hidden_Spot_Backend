import { Router } from "express";
import {
  userLogin,
  userRegister,
  verifyUserSendEmail,
} from "../controllers/user.controllers.js";
const router = Router();
import { upload } from "../middlewares/multer.middlewares.js";

// user route
router.route("/register").post(upload.single("avatar"), userRegister);
router.route("/register/:userId/:token").get(verifyUserSendEmail);
router.route("/login").post(userLogin);

export default router;
