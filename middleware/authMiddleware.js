import JWT from "jsonwebtoken";
import { testControler } from "../controllers/authController.js";
import userModel from "../models/userModel.js";
//procted Rout
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    // console.log(error);
  }
};

//Admin Route

export const isAdmin = async (req, res,next) => {
  try {
    // const user=await userModel.findById(req.user._id)
    const user = await userModel.findById(req.user._id);
    if (!user) {
      // Check if user exists
      return res.status(401).send({
        success: false,
        message: "User not found",
      });
    }

    if (user.role== 1) {
      next();
    } else {
        return res.status(401).send({
            success: false,
            massage: "UnAuthorization Access",
        });
    }
  } catch (error) {
    // console.log(error);
    res.status(403).send({
      success: false,
      error,
      massage: "Error in Middelware",
    });
  }
};
