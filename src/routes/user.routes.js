import { Router } from "express";
import { userRegister, verifyUserSendEmail } from "../controllers/user.controllers.js";
const router = Router();
import {upload} from "../middlewares/multer.middlewares.js";

// user route
router.route("/register").post(upload.single("avatar"), userRegister);
router.route("/register/:userId/:token").get(verifyUserSendEmail)

export default router;
