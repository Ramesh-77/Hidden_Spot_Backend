import { asyncHandler } from "../utils/asyncHandler.js";
import { Menu } from "../models/menu.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { Item } from "../models/item.models.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { Service } from "../models/service.models.js";

// menu controllers
// add menu by admin only
export const addMenu = asyncHandler(async (req, res) => {
  const { menuName, admin } = req.body;

  // existing menu
  const menu = await Menu.findOne({
    menuName: menuName,
  });

  if (menu) {
    throw new ApiError(400, "Menu already exist");
  }

  const createdMenu = await Menu.create({
    menuName: menuName,
    admin: admin,
  });

  await createdMenu.save();
  return res
    .status(200)
    .json(new ApiResponse(201, createdMenu, "Menu added successfully"));
});

// get all the added menu
export const getAllMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.find();
  if (!menu) {
    throw new ApiError(400, "something went wrong while fetching menu data");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, menu, "Menu fetched successfully"));
});

// delete menu
export const deleteMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.findByIdAndDelete(req.params.id);
  if (!menu) {
    throw new ApiError(400, "Something went wrong while deleting menu");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Menu deleted successfully"));
});

// get single menu by it
export const getSingleMenu = asyncHandler(async (req, res) => {
  const menu = await Menu.findById(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, menu, "Single menu data fetched successfully"));
});

// update menu
export const updateMenu = asyncHandler(async (req, res) => {
  const { menuName, admin } = req.body;
  const menu = await Menu.findByIdAndUpdate(
    req.params.id,
    {
      menuName: menuName,
      admin: admin,
    },
    { new: true }
  );

  console.log("update", menu);
  if (!menu) {
    throw new ApiError(400, "Something went wrong while updating menu");
  }
  await menu.save();
  return res
    .status(200)
    .json(new ApiResponse(200, menu, "menu updated successfull"));
});

// item controllers
// add item by admin
export const addItem = asyncHandler(async (req, res) => {
  const { itemName, itemPrice, itemQuantity, menu, itemDesc, admin } = req.body;

  console.log("item details", itemName, req.body);
  const avatar = req.files.map((file) => file.path);
  console.log("image", avatar);
  const item = await Item.create({
    itemName: itemName,
    itemPrice: itemPrice,
    itemQuantity: itemQuantity,
    itemDesc: itemDesc,
    menu: menu,
    admin: admin,
    avatar: avatar,
  });
  console.log("item up", item);

  await item.save();
  return res
    .status(201)
    .json(new ApiResponse(200, item, "Item added successfully"));
});

// get item
export const getItem = asyncHandler(async (req, res) => {
  const item = await Item.find();
  if (!item) {
    throw new ApiError(400, "Something wrong while loading items...");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, item, "fetching item successfully"));
});

// delete item
export const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findByIdAndDelete(req.params.id);
  if (!item) {
    throw ApiError(400, "something went wrong while deleting item");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "item deleted successfully"));
});

// updata item
export const updateItem = asyncHandler(async (req, res) => {
  const { itemName, itemPrice, itemQuantity, menu, itemDesc, admin } = req.body;
  const avatar = req?.file?.path;

  const item = await Item.findByIdAndUpdate(
    req.params.id,
    {
      itemName: itemName,
      itemDesc: itemDesc,
      itemPrice: itemPrice,
      itemQuantity: itemQuantity,
      menu: menu,
      admin: admin,
      avatar: avatar,
    },
    {
      new: true,
    }
  );

  if (!item) {
    throw ApiError(400, "something went wrong while updating item");
  }
  await item.save();
  return res
    .status(200)
    .json(new ApiResponse(200, item, "item has been updated successfully"));
});

// get single item by it
export const getSingleItem = asyncHandler(async (req, res) => {
  const menu = await Item.findById(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, menu, "Single item data fetched successfully"));
});

// add service by admin
export const addService = asyncHandler(async (req, res) => {
  const { serviceName, serviceDesc, admin } = req.body;
  const avatar = req?.file?.path;

  // existing menu
  const service = await Service.findOne({
    serviceName: serviceName,
  });

  if (service) {
    throw new ApiError(400, "Service already exist");
  }

  const createdService = await Service.create({
    serviceName: serviceName,
    serviceDesc: serviceDesc,
    admin: admin,
    avatar: avatar,
  });
  if (!createdService) {
    throw ApiError(400, "Something went wrong while adding service");
  }
  await createdService.save();
  return res
    .status(200)
    .json(new ApiResponse(201, createdService, "Service added successfully"));
});

// get all the added service
export const getAllService = asyncHandler(async (req, res) => {
  const service = await Service.find();
  if (!service) {
    throw new ApiError(400, "something went wrong while fetching service data");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, service, "Service fetched successfully"));
});

// delete service
export const deleteService = asyncHandler(async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    throw new ApiError(400, "Something went wrong while deleting service");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Service deleted successfully"));
});

// update menu
export const updateService = asyncHandler(async (req, res) => {
  const { serviceName, serviceDesc, admin } = req.body;
  const avatar = req?.file?.path;
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    {
      serviceName: serviceName,
      serviceDesc: serviceDesc,
      admin: admin,
      avatar: avatar
    },
    { new: true }
  );

  console.log("update", service);
  if (!service) {
    throw new ApiError(400, "Something went wrong while updating service");
  }
  await service.save();
  return res
    .status(200)
    .json(new ApiResponse(200, service, "service updated successfull"));
});

// get single item by it
export const getSingleService = asyncHandler(async (req, res) => {
  const service = await Service.findById(req.params.id);
  return res
    .status(200)
    .json(new ApiResponse(200, service, "Single service data fetched successfully"));
});
