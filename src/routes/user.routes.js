import { Router } from "express";
import { userRegister } from "../controllers/user.controllers.js";
const router = Router();
import {upload} from "../middlewares/multer.middlewares.js";

// user route
router.route("/register").post(upload.single("avatar"), userRegister);

export default router;
