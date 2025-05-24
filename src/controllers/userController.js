const jwt = require("jsonwebtoken");
const moment = require("moment");
const {
  isValidRequestBody,
  isValid,
  checkName,
  phoneNub,
  emailMatch,
  matchPass,
  isValidPincode,
} = require("../Validations/validations");
const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const secretkey = process.env.SECRETKEY;
console.log(secretkey);

// ------------------------------------------Create Author -------------------------------------------------------------------------------------------------------------

const createUser = async function (req, res) {
  try {
    let data = req.body;
    let { title, name, phone, email, password, address } = data;

    if (!isValid(title))
      return res
        .status(400)
        .send({ status: false, message: "Please enter title" });
    if (title !== "Mr" && title !== "Mrs" && title !== "Miss")
      return res
        .status(400)
        .send({ status: false, message: "title must be Mr, Mrs or Miss" });

    if (!isValid(name))
      return res
        .status(400)
        .send({ status: false, message: "Please enter name" });
    if (!checkName(name))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid name" });

    if (!isValid(phone))
      return res
        .status(400)
        .send({ status: false, message: "Please enter phone number" });
    if (!phoneNub(phone))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid phone number" });

    if (!isValid(email))
      return res
        .status(400)
        .send({ status: false, message: "Please enter email" });
    if (!emailMatch(email))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid email address" });
    const checkExitingUser = await userModel.findOne({
      $or: [{ phone: phone }, { email: email }],
    });
    if (checkExitingUser) {
      if (checkExitingUser.phone === phone)
        return res
          .status(409)
          .send({ status: false, message: "Phone number already exists" });
      if (checkExitingUser.email === email)
        return res
          .status(409)
          .status({ status: false, message: "Entered email already exists" });
    }

    if (!isValid(password))
      return res
        .status(400)
        .send({ status: false, message: "Please enter password" });
    if (!matchPass(password))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid password" });

    // Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    data.password = hashedPassword;

    if (!isValid(address))
      return res
        .status(400)
        .send({ status: false, message: "Please enter address" });

    if (address && typeof address !== "object") {
      return res
        .status(400)
        .send({ status: false, message: "Address is in wrong formate" });
    }
    if (address && address.pincode && !isValidPincode(address.pincode)) {
      return res
        .status(400)
        .send({ status: false, message: "Pincode is in wrong formate" });
    }

    let createuser = await userModel.create(data);
    return res
      .status(201)
      .send({
        status: true,
        message: "User created successfully",
        data: createuser,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

//------------------------------------------User login ----------------------------------------------------------------------------------

const userLogin = async function (req, res) {
  try {
    let userName = req.body.email;
    let password = req.body.password;

    if (!isValid(userName))
      return res
        .status(400)
        .send({ status: false, message: "Please enter username" });
    if (!emailMatch(userName))
      return res
        .status(400)
        .send({ status: false, message: "Please enter email" });
    let checkUser = await userModel.findOne({ email: userName });
    console.log(checkUser);
    if (!checkUser)
      return res
        .status(401)
        .send({ status: false, message: "Invalid username" });

    if (!isValid(password))
      return res
        .status(400)
        .send({ status: false, message: "Plase enter Password" });
    const isPasswordMatch = await bcrypt.compare(password, checkUser.password);
    if (!matchPass(password))
      return res
        .status(400)
        .send({ status: false, message: "Please enter valid password" });

    const token = await jwt.sign(
      {
        userId: checkUser._id.toString(),
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(moment().add(1, "days")),
      },
      secretkey
    );

    const data = {
      token: token,
      iat: token.iat,
      exp: token.exp,
    };

    return res
      .status(201)
      .send({ status: true, message: "Login successfully", data: data });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: "Error", error: err.message });
  }
};

module.exports = { createUser, userLogin };
