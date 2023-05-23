import React from "react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <>
      <aside>
        <ul className="sidebarul">
          <Link to="/dashboard">
            <li>Dashboard</li>
          </Link>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
