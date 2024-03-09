import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Token } from "../models/token.models.js";
import { randomBytes } from "crypto";
import { verifyEmail } from "../utils/sendMail.js";
import jwt from "jsonwebtoken";

// handle generate access and refresh token function
// export const generateUserAccessAndRefreshTokens = asyncHandler(
//   async (userId) => {
//     try {
//       // generate access token
//       const user = await User.findById(userId);
//       // generate access and refresh token
//       const accessToken = await user.generateUserAccessToken();
//       const refreshToken = await user.generateUserRefreshToken();
//       console.log("access token", accessToken)
//       // save refresh token to database
//       user.refreshToken = refreshToken;

//       /**
//        *  validate before save false so that no need to validate again to save
//        * refresh token
//        *  */
//       await user.save({ validateBeforeSave: false });
//       // return the tokens
//       console.log("user refresh token ", user.refreshToken)
//       // console.log("user", user)

//       return {accessToken, refreshToken};
//     } catch (error) {
//       throw new ApiError(
//         500,
//         "Something went wrong while generating access and refresh token"
//       );
//     }
//   }
// );

// handle generate access token only
export const generateUserAccessTokenOnly = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = await user.generateUserAccessToken();
    return accessToken;
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access token"
    );
  }
};
// handle generate refresh token only
export const generateUserRefreshTokenOnly = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = await user.generateUserRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return refreshToken;
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh token"
    );
  }
};

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

// user login
export const userLogin = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  // empty check

  if (!(username || email) || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // user credentials field check
  if (!(username || email)) {
    throw new ApiError(400, "username or email is required");
  }

  // check if user exist or not
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  // console.log("user id", user?._id)
  if (!user) {
    throw new ApiError(400, "username or email doesn not exist");
  }

  // checking only verified user can log in

  const isPasswordValid = await user.isUserPasswordCorrect(password);
  // console.log("password valid", isPasswordValid)
  // if password does not match with db pass
  if (!isPasswordValid) {
    throw new ApiError(401, "password does not match");
  }

  if (!user.isVerified) {
    throw new ApiError(400, "user is not authenticate");
  }

  // access and refresh token generate
  // const { accessToken, refreshToken } = await generateUserAccessAndRefreshTokens(user?._id)
  // let { accessToken, refreshToken } =
  //    await generateUserAccessAndRefreshTokens(user?._id);

  // access token func call
  const accessToken = await generateUserAccessTokenOnly(user?._id);
  const refreshToken = await generateUserRefreshTokenOnly(user?._id);

  // save the user data
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // configure the cookie options
  const cookieOptions = {
    httpOnly: true, //cookie only modified by server
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "login successfull"
      )
    );
});

// user logout
export const userLogout = asyncHandler(async (req, res) => {
  await User.findById(
    req.user?._id,
    {
      // delete refresh token
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );
  // cookie config
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshCookie", cookieOptions)
    .json(new ApiResponse(200, {}, "user logout"));
});

// get CurrentUser
export const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user data fetched"));
});

/**
 * if access token is expired while using service,
 * generate new access token with help of refresh token
 */
export const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    // get refresh token from user via cookie or body
    const incomingRefreshToken =
      req.user?.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized refresh token ");
    }
    // verify refresh token with refresh token secret key
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    // find user by verify token
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Unauthorized user");
    }

    // matching the user provided refresh token and db refresh token
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is already used or expired");
    }
    // generate new access token and refresh token
    const accessToken = await generateUserAccessTokenOnly(user?._id);
    const refreshToken = await generateUserRefreshTokenOnly(user?._id);

    // set the tokens in cookie
    const cookieOptions = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message, "Invalid refresh token");
  }
});

// current User password changed
export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  // check empty
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "All fields required");
  }

  // get current user
  const user = await User.findOne(req.user?._id);
  if (!user) {
    throw new ApiError(400, "invalid user");
  }

  // compare old and new pass if same
  const isOldPasswordCorrect = await user.isUserPasswordCorrect(oldPassword);
  if (!isOldPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  // checking whether new and old pass same
  if (newPassword === isOldPasswordCorrect) {
    throw new ApiError(400, "new password cannot be same as old password");
  }

  user.password = newPassword;

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
