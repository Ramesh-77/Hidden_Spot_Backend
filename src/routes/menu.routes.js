import { Router } from "express";
import {
  addItem,
  addMenu,
  deleteItem,
  deleteMenu,
  getAllMenu,
  getItem,
  getSingleItem,
  getSingleMenu,
  updateItem,
  updateMenu,
} from "../controllers/menu.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();

// menu route
router.route("/add-menu").post(addMenu);
router.route("/get-menu").get(getAllMenu);
router.route("/delete-menu/:id").post(deleteMenu);
router.route("/single-menu/:id").get(getSingleMenu);
router.route("/update-menu/:id").put(updateMenu);

// item or product route
router.route("/add-item").post(upload.array("avatar", 5), addItem);
router.route("/get-item").get(getItem);
router.route("/delete-item/:id").post(deleteItem)
// router.route("/update-item/:id").put(upload.array("avatar", 5),updateItem)
router.route("/update-item/:id").put(upload.single("avatar"),updateItem)

router.route("/single-item/:id").get(getSingleItem)
// router.route("/add-item").post(upload.single("avatar"), addItem)

export default router;
