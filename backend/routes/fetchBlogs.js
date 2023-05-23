const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const blogModel = require("../models/Blog");

router.get("/", async (req, res, next) => {
  try {
    const { page, search } = req.query;
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const author = decoded.id;

    const pageSize = 5; // Number of rows per page
    const skip = (parseInt(page) - 1) * pageSize;

    // Prepare the query object
    const query = { author };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { body: { $regex: search, $options: "i" } },
      ];
    }

    const totalItems = await blogModel.countDocuments(query);
    const totalPages = Math.ceil(totalItems / pageSize);

    const data = await blogModel.find(query).skip(skip).limit(pageSize).lean();

    return res.status(201).json({
      success: true,
      data: data,
      totalPages: totalPages,
      message: "Blogs fetched successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
