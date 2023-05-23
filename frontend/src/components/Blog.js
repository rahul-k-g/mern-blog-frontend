import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import Cookies from "js-cookie";
const CreateBlog = () => {
  const navigate = useNavigate();
  const token = useSelector(
    (state) => state.login.token || Cookies.get("token")
  );

  // If user is not logged in (no token), redirect to the login page

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const postData = {};

  const handleContentChange = (value) => {
    setContent(value);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      postData["title"] = title;
      postData["body"] = content;

      const response = await axios.post(
        "http://localhost:5050/api/v1/blogs",
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Add the token to the Authorization header
          },
          withCredentials: true,
        }
      );

      console.log(response.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="container">
        <Header page="createBlog" title="Create Blogs" />
        <main className="blogmain">
          <section className="listing">
            <form onSubmit={handlePost}>
              <div className="box">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  onChange={handleTitle}
                  value={title}
                />
              </div>
              <div className="box">
                <label htmlFor="postContent">Body</label>
                <ReactQuill value={content} onChange={handleContentChange} />
              </div>
              <div className="box">
                <button type="submit" className="blogbtn">
                  Post
                </button>
              </div>
            </form>
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default CreateBlog;
