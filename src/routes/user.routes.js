import { Router } from "express";
import {
  changeCurrentPassword,
  deleteRegisteredUser,
  getCurrentUser,
  getRegisteredUserData,
  userLogin,
  userLogout,
  userRegister,
  verifyUserSendEmail,
} from "../controllers/user.controllers.js";
const router = Router();
// import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

// user route
// router.route("/register").post(upload.single("avatar"), userRegister);
router.route("/register").post(userRegister);
router.route("/register/:userId").post(verifyUserSendEmail);
// router.route("/register/verifyEmail").post(verifyUserEmailOTP)
router.route("/login").post(userLogin);
router.route("/logout").post(verifyJWT, userLogout);

router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router
  .route("/changed-current-user-password")
  .post(verifyJWT, changeCurrentPassword);

  // admin purpose only

  // get all user data
  router.route("/get-registered-users").get(getRegisteredUserData)

  // delete particular user
  router.route("/delete-registered-user/:id").post(deleteRegisteredUser)


export default router;
