// backend/server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const register = require("./routes/register");
const login = require("./routes/login");
const createBlog = require("./routes/createBlog");
const fetchBlogs = require("./routes/fetchBlogs");
const blogOperations = require("./routes/blogOperations");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with the actual origin of your frontend application
    credentials: true, // Allow credentials (cookies)
  })
);

// Connect to MongoDB
mongoose.connect(process.env.URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB connection has been established!");
});

// Router
app.use("/api/v1/register", register);
app.use("/api/v1/login", login);
app.use("/api/v1/blogs", createBlog);
app.use("/api/v1/fetchBlogs", fetchBlogs);
app.use("/api/v1/blogOperations", blogOperations);
// Serve static files in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
