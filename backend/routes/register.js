const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const userModel = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  try {
    let user = await userModel.findOne({ username: req.body.username });
    if (user) {
      return res
        .status(409)
        .json({ message: "User already exists, please login" });
    } else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new userModel({
        username: req.body.username,
        password: hashedPassword,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
      });
      return res
        .status(201)
        .json({ success: true, message: "Registered Successfully", token });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
