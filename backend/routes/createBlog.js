const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const blogModel = require("../models/Blog");

router.post("/", async (req, res, next) => {
  // Add 'next' as a parameter
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const author = decoded.id;
    const { title, body } = req.body;
    const newBlog = new blogModel({
      title,
      body,
      author,
    });
    await newBlog.save();
    return res
      .status(201)
      .json({ success: true, message: "Blog created successfully" });
  } catch (error) {
    console.log(error);
    next(error); // Call the 'next' function with the error to trigger the error handling middleware
  }
});

module.exports = router;
