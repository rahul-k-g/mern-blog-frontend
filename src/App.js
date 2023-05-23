import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Blog from "./components/Blog";
import EditBlog from "./components/EditBlog";
import ViewBlog from "./components/viewBlog";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/edit/:id" element={<EditBlog />} />
        <Route path="/view/:id" element={<ViewBlog />} />
        <Route path="/" exact element={<Login />} />
        <Route path="*" element={<h1>404 not found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
