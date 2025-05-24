const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const userModel = require("../models/userModel");

// ================================= athentication ==========================================//

const authentication = async function (req, res, next) {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .send({
          status: false,
          message: "Authorization token missing or invalid",
        });
    }

    const token = authHeader.split(" ")[1];

    let decodedtoken = jwt.verify(token, "Scretekeyforlogin");
    

    if (!decodedtoken)
      return res.status(401).send({ status: false, message: "Invalid token" });

    const user = await userModel.findOne({_id: decodedtoken.userId})
    // console.log("Authentication user ",user)
    if(!user) {return res.status(404).send({status:false, message:"User not found"})}
    if(user.isDeleted) return res.status(404).send({status:false, message:"User not found"})
    req.user = user;
    next();
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, msg: "Error", error: err.message });
  }
};

module.exports = authentication