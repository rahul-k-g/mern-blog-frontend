import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Cookies from "js-cookie";
import "./Dashboard.css";

const EditBlog = () => {
  const { id } = useParams(); // Get the blog ID from the URL parameters
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const token = useSelector(
    (state) => state.login.token || Cookies.get("token")
  );

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5050/api/v1/blogOperations/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.data.data) {
        setTitle(response.data.data.title);
        setContent(response.data.data.body);
      } else {
        console.log(response.data.message);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:5050/api/v1/blogOperations/${id}`,
        {
          title,
          body: content,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if (response.data.success) {
        navigate("/dashboard");
      } else {
        console.log(response.data.message);
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="container">
        <Header page="createBlog" title="Edit Blog" />
        <main className="blogmain">
          <section className="listing">
            <form onSubmit={handleUpdate}>
              <div className="box">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="box">
                <label htmlFor="postContent">Body</label>
                <ReactQuill
                  value={content}
                  onChange={(value) => setContent(value)}
                />
              </div>
              <div className="box">
                <button type="submit" className="blogbtn">
                  Update
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

export default EditBlog;
