import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../reducers/loginSlice";
import axios from "axios";
import baseURL from "./apiConfig.js";
const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [regData, setRegData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputs = (e) => {
    setRegData({
      ...regData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseURL}/api/v1/register`, regData);
      const token = res.data.token;
      dispatch(setToken(token)); // Dispatch the action to set the token in Redux store
      navigate("/dashboard"); // Redirect to the Dashboard component
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div className="regcontainer">
      <main className="regmain">
        <h1>Register</h1>
        <div className="register">
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              autoComplete="off"
              onChange={handleInputs}
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="off"
              required
              onChange={handleInputs}
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="off"
              required
              onChange={handleInputs}
            />
            <input type="submit" value="Submit" />
          </form>
          <p className="instruction">
            If already registered, login <Link to="/login">here.</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Register;
