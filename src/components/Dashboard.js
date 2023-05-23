import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Dashboard.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import Cookies from "js-cookie";
import axios from "axios";
import baseURL from "./apiConfig.js";
const Dashboard = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const token = useSelector(
    (state) => state.login.token || Cookies.get("token")
  );

  useEffect(() => {
    fetchData();
  }, [currentPage, searchQuery]);

  async function fetchData() {
    try {
      const response = await axios.get(
        `${baseURL}/api/v1/fetchBlogs?page=${currentPage}&search=${searchQuery}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      const { data: responseData, totalPages } = response.data;
      setData(responseData);
      setTotalPages(totalPages);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/v1/blogOperations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      fetchData();
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteSelected = async () => {
    const selectedRows = data.filter((item) => item.selected);
    if (selectedRows.length === 0) {
      return;
    }
    try {
      const deletePromises = selectedRows.map((row) =>
        axios.delete(`${baseURL}/api/v1/blogOperations/${row._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
      );
      await Promise.all(deletePromises);
      fetchData();
    } catch (error) {
      console.log(error.message);
    }
  };

  const toggleSelectAll = () => {
    const updatedData = data.map((item) => ({
      ...item,
      selected: !selectAll,
    }));
    setData(updatedData);
    setSelectAll(!selectAll);
  };

  const toggleSelectRow = (id) => {
    const updatedData = data.map((item) => {
      if (item._id === id) {
        return {
          ...item,
          selected: !item.selected,
        };
      }
      return item;
    });
    setData(updatedData);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchData();
  };

  const confirmDelete = (id) => {
    const result = window.confirm("Are you sure to delete this?");
    if (result) {
      handleDelete(id);
    }
  };

  const confirmDeleteSelected = () => {
    const result = window.confirm("Are you sure to delete these?");
    if (result) {
      deleteSelected();
    }
  };
  const stripHTMLTags = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      const truncatedText = text.slice(0, maxLength) + "...";
      return truncatedText;
    }
    return text;
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="container">
        <Header page="dashboard" title="Blogs" />
        <main className="blogmain">
          <section className="listing">
            {data.length > 0 || totalPages > 0 ? (
              <>
                <div className="btns">
                  <button
                    type="button"
                    className="blogbtn delbtn"
                    onClick={confirmDeleteSelected}
                  >
                    Delete Selected
                  </button>
                  <input
                    type="text"
                    id="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="button"
                    className="blogbtn"
                    onClick={handleSearch}
                  >
                    Search
                  </button>
                </div>
                <table className="blog">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={selectAll}
                          onChange={toggleSelectAll}
                        />
                      </th>
                      <th>SI no</th>
                      <th>Title</th>
                      <th>Body</th>
                      <th colSpan="3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item, index) => (
                      <tr key={item._id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleSelectRow(item._id)}
                          />
                        </td>
                        <td>{(currentPage - 1) * 5 + index + 1}</td>
                        <td>{item.title}</td>

                        <td>{truncateText(stripHTMLTags(item.body), 24)}</td>

                        <td>
                          <Link to={`/view/${item._id}`}>
                            <button type="button" className="blogbtn">
                              View
                            </button>
                          </Link>
                        </td>
                        <td>
                          <Link to={`/edit/${item._id}`}>
                            <button type="button" className="blogbtn">
                              Edit
                            </button>
                          </Link>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="blogbtn"
                            onClick={() => confirmDelete(item._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="pagination">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                  <div className="pagination-info">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </>
            ) : (
              <p>No data to display</p>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
