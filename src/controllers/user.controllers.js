import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// user register
export const userRegister = asyncHandler(async (req, res) => {
  // getting user details from frontend
  const { fullName, username, email, password, phone } = req.body;

  //   checking empty field
  if (
    [fullName, username, email, password, phone].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //   checking existed user if already registerd
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  //   if user found
  if (existedUser) {
    throw new ApiError(
      400,
      "user with given username or email already existed"
    );
  }

  // upload image to cloudinary
  const avatar = await uploadOnCloudinary(req.file?.path);
  //   if not found
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  // save data to database
  const user = await User.create({
    fullName,
    username,
    email,
    phone,
    avatar: avatar.url,
    password,
  });

  // sending required data attached to user obj
  const userCreated = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, "User registration successful"));
});
