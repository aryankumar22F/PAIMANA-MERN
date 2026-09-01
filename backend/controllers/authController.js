import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc Register new user
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, ministry } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password, role, ministry });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc Login user
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
     
    if (user && (await user.matchPassword(password))) {

       const token = generateToken(user._id);

       res.cookie("jwt", token, {
        httpOnly : true,
        sameSite : 'strict',
        maxAge : 3600000
       })

       return res.status(200).json({
             _id : user._id,
             name : user.name,
             email : user.email,
             role : user.role,
             token : token
       });
     
    } else {
     return  res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
   return  res.status(500).json({ message: error.message });
  }
};


export const logoutController = async(_, res)=>{
  res.cookie("jwt", "", {maxAge : 0});
  return res.status(200).json({
    message : "Logged Out Successfully"
  })
}
// @desc Get logged-in user profile
// @route GET /api/auth/me
export const getProfile = async (req, res) => {
  
  res.json(req.user);
};

