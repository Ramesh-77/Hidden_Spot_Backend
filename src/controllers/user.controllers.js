import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Token } from "../models/token.models.js";
import { randomBytes } from "crypto";
import { verifyEmail } from "../utils/sendMail.js";

// email verification user
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
  // // save the user
  // res
  //   .status(201)
  //   .json(new ApiResponse(200, userCreated, "User registration successful"));
  await userCreated.save();

  // create new token
  const token = await Token.create({
    userId: user?._id,
    token: randomBytes(16).toString("hex"),
  });
  // save the token in db
  // res
  //   .status(201)
  //   .json(new ApiResponse(200, token, "new user token is created"));
  await token.save();

  // create frontend link to send to user gmail

  const link = `http://123.0.0.1:3000/api/v1/users/register/${user._id}/${token?.token}`;
  console.log("token link", link);

  // send link to requested gmail
  await verifyEmail(
    email,
    "Hidden Spot - Activation link",
    `
    <div>
    <a href=${link}>Click here to activate your account</a>
    </div>
    `
  );
  if (!verifyEmail) {
    throw new ApiError(
      500,
      "something went wrong while sending gmail verification link"
    );
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Email verification link sent to your account, please activate to continue"
      )
    );
  // .send({
  //   message: "email activation link sent already",
  // })
});

// activate the user via email
export const verifyUserSendEmail = asyncHandler(async (req, res) => {
  try {
    const { userId, token } = req.params;

    const tokenUser = await Token.findOne({
      userId: userId,
      token: token,
    });
    if (!tokenUser) {
      throw new ApiError(401, "token and user id is not found");
    }
    const user = await User.findByIdAndUpdate(
      tokenUser?.userId,
      {
        $set: {
          isVerified: true,
        },
      },
      { new: true }
    );

    await Token.findByIdAndDelete(tokenUser?._id);
    return res
      .status(200)
      .json(new ApiResponse(200, user, "Account verified successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong while activating account");
  }
});
