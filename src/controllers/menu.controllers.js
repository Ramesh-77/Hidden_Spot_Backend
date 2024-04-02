import { asyncHandler } from "../utils/asyncHandler.js";
import {Menu} from "../models/menu.models.js"
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";


// menu controllers
// add menu by admin only
export const addMenu = asyncHandler(async(req, res)=>{
    const {menuName, admin}  = req.body;
    console.log(menuName)

    // existing menu 
    const menu = await Menu.findOne({
        menuName: menuName
    })
    if(menu){
        throw new ApiError(400, "Menu already exist")
    }

    const createdMenu  = await Menu.create({
        menuName: menuName,
        admin: admin
    })

    await createdMenu.save()
    return res.status(200).json(
        new ApiResponse(201, createdMenu, "Menu added successfully")
    )
}) 

// get all the added menu
export const getAllMenu = asyncHandler(async(req, res)=>{
    const menu = await Menu.find()
    if(!menu){
        throw new ApiError(400, "something went wrong while fetching menu data")
    }
    return res.status(200).json(
       new ApiResponse(200, menu, "Menu fetched successfully")
    )
})

// delete menu
export const deleteMenu = asyncHandler(async(req, res)=>{
    const menu = await Menu.findByIdAndDelete(req.params.id)
    if(!menu){
        throw new ApiError(400, "Something went wrong while deleting menu")
    }
    return res.status(200).json(
        new ApiResponse(200, {}, "Menu deleted successfully")
    )
})

// get single menu by it
export const getSingleMenu = asyncHandler(async(req, res)=>{
    const menu = await Menu.findById(req.params.id)
    return res.status(200).json(
        new ApiResponse(200, menu, "Single menu data fetched successfully")
    )
})

// update menu
export const updateMenu = asyncHandler(async(req, res)=>{
    const {menuName, admin} = req.body;
    const menu = await Menu.findByIdAndUpdate(req.params.id, {
        menuName: menuName,
        admin: admin,
        
    }, {new: true})
    
    console.log("update", menu)
    if(!menu){
        throw new ApiError(400, "Something went wrong while updating menu")
    }
    await menu.save()
    return res.status(200).json(
        new ApiResponse(200, menu, "menu updated successfull")
    )
})

// item controllers
// add item by admin
export const addItem = asyncHandler(async(req, res)=>{
    const {itemName, itemPrice, itemQuantity, menu, itemDesc} = req.body;
})
