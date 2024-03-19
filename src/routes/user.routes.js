import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  userLogin,
  userLogout,
  userRegister,
  verifyUserSendEmail,
} from "../controllers/user.controllers.js";
const router = Router();
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

// user route
// router.route("/register").post(upload.single("avatar"), userRegister);
router.route("/register").post(userRegister);
router.route("/register/:userId/:token").get(verifyUserSendEmail);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyJWT, userLogout);

router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router
  .route("/changed-current-user-password")
  .post(verifyJWT, changeCurrentPassword);

  // for testing using params
// router.route("/get-current-user/:userId").get(getCurrentUser);
// router.route("/changed-pass/:userId").post(changeCurrentPassword);


export default router;
