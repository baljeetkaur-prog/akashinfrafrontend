import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

const Topbar = () => {
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin-login";
  };

  return (
    <header className="admin-topbar">
      <div className="topbar-left">
        <span className="site-name">Akash Infra</span>
      </div>

      <div className="topbar-right">
        <div
          className="admin-user"
          onClick={() => setOpen(!open)}
        >
          <FaUserCircle />
          <span>Admin</span>
        </div>

        {open && (
          <div className="admin-dropdown">
            <button onClick={logout}>Log Out</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Topbar;
