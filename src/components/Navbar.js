import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        Advanced CRM
      </Link>
      <div>
        <Link to="/login" className="btn btn-outline-light me-2">Login</Link>
        <Link to="/signup" className="btn btn-outline-light">Signup</Link>
      </div>
    </nav>
  );
};

export default Navbar;