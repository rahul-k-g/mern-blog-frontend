import React, { useState, useEffect } from "react";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../reducers/loginSlice";
import axios from "axios";
import baseURL from "./apiConfig.js";
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState(false);

  const handleInputs = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseURL}/api/v1/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const token = res.data.token;
      dispatch(setToken(token)); // Dispatch the action to set the token in Redux store
      // Redirect to the Dashboard component
      navigate("/dashboard");
    } catch (e) {
      console.log(e.message);
      setLoginError(true);
    }
  };

  useEffect(() => {
    setFormData({ username: "", password: "" });
    setLoginError(false);
  }, []);

  return (
    <div className="logincontainer">
      <main className="loginmain">
        <h1>Login</h1>
        <div className="login">
          <form
            onSubmit={handleSubmit}
            onReset={() => {
              setFormData({ username: "", password: "" });
              setLoginError(false);
            }}
          >
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              required
              value={formData.username}
              onChange={handleInputs}
              autoComplete="off"
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={handleInputs}
              autoComplete="off"
            />
            <input type="submit" value="Submit" />
            <input type="reset" value="Reset" />
          </form>
          {loginError && <p>Login failed. Please try again.</p>}
          <p className="instruction">
            If not registered, register <Link to="/register">here.</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;
