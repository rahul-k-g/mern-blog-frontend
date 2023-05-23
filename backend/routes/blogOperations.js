const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const blogModel = require("../models/Blog");

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const author = decoded.id;
    const data = await blogModel.findOne({ _id: id }).lean();
    return res.status(200).json({
      success: true,
      data: data,
      message: "Blog fetched successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const { title, body } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const author = decoded.id;
    const data = await blogModel
      .findOneAndUpdate({ _id: id }, { title, body }, { new: true })
      .lean();
    return res.status(200).json({
      success: true,
      data: data,
      message: "Blog updated successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const author = decoded.id;
    const data = await blogModel.deleteOne({ _id: id }).lean();
    return res.status(200).json({
      success: true,
      data: data,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.delete("/", async (req, res, next) => {
  try {
    const { ids } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const author = decoded.id;
    const data = await blogModel.deleteMany({ _id: { $in: ids } }).lean();
    return res.status(200).json({
      success: true,
      data: data,
      message: "Selected blogs deleted successfully",
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
