import { Router } from "express";
import { addMenu, deleteMenu, getAllMenu, getSingleMenu, updateMenu } from "../controllers/menu.controllers.js";
// import { verifyJWT } from "../middlewares/auth.middlewares.js";
const router = Router()




// add menu route
router.route("/add-menu").post(addMenu)
router.route("/get-menu").get(getAllMenu)
router.route("/delete-menu/:id").post(deleteMenu)
router.route("/single-menu/:id").get(getSingleMenu)
router.route("/update-menu/:id").put(updateMenu)


export default router;
