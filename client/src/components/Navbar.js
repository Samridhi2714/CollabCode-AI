import { Link } from "react-router-dom";
import "../styles/room.css";

function Navbar() {
  return (
    <div className="navbar">
      <Link to="/"
        className="nav-btn"
      > Home
      </Link>

      <Link to="/login"
        className="nav-btn"
      > Login
      </Link>

      <Link to="/register"
        className="nav-btn"
      > Register
      </Link>

      <Link to="/dashboard"
        className="nav-btn"
      > Dashboard
      </Link>
    </div>
  );
}

export default Navbar;