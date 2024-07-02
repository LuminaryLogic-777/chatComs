const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (_id) => {
  const jwt_key = process.env.JWT_TOKEN;
  return jwt.sign({ _id }, jwt_key, { expiresIn: "3d" });
};
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json("User Already Exists");
    }
    if (!name || !email || !password) {
      return res.status(400).json("All fields are required!");
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json("Enter a valid Email");
    }
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json("Password not strong enough");
    }
    // Encrypt password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new userModel({ name, email, password: hashedPassword });
    await user.save();
    const token = createToken(user._id);
    res.status(200).json({ _id: user._id, name, email, token });
  } catch (err) {
    res.status(400).json(err);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });

  if (!email || !password) {
    return res.status(400).json("All fields are required!");
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json("Enter a valid Email");
  }
  if (!user) {
    return res.status(400).json("User does not exist");
  }
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(400).json("Wrong credentials");
  }

  const token = createToken(user._id);
  res.status(200).json({ _id: user._id, name: user.name, email, token });
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId,{ password: 0 });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
const getUsers = async (req, res) => {
  try {
    // Find users and exclude the password field
    const users = await userModel.find({}, { password: 0 });

    // Format the response to include only the desired fields
    // const userResponses = users.map(user => ({
    //   _id: user._id,
    //   name: user.name,
    //   email: user.email
    // }));

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "An error occurred while fetching users" });
  }
};

module.exports = { registerUser, loginUser, findUser, getUsers };
