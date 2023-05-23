import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearToken } from "../reducers/loginSlice";
import "./Dashboard.css";
const Header = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    dispatch(clearToken());
    navigate("/");
  };
  return (
    <>
      <header className="blogheader">
        <h1>{props.title}</h1>
        <nav className="head-nav">
          <ul>
            <li className="logout" onClick={handleLogout}>
              Logout
            </li>
          </ul>
        </nav>
        {props.page === "dashboard" ? (
          <Link to="/blog">
            <button className="createbtn">{"Create"}</button>
          </Link>
        ) : (
          ""
        )}
      </header>
    </>
  );
};

export default Header;
