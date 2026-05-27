
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFolderPlus, FaSignInAlt, FaSignOutAlt, FaUpload, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdAccountBox, MdSubscriptions } from "react-icons/md"
import "./DirectoryHeader.css";


function DirectoryHeader() {
  // Use a constant for the API base URL
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest User");
  const [userEmail, setUserEmail] = useState("guest@example.com");
  const [userPicture, setUserPicture] = useState("");
  const [usedStorageinBytes, setusedStorageinBytes] = useState(0);
  const [maxStorageinBytes, setmaxStorageinBytes] = useState(0);
  const [userRole, setUserRole] = useState("user");

  const navigate = useNavigate();

  const usedGB = usedStorageinBytes / 1024 ** 3
  const totalGB = maxStorageinBytes / 1024 ** 3

  // console.log(directoryName);


  // -------------------------------------------
  // 1. Fetch user info from /user on mount
  // -------------------------------------------
  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch(`${BASE_URL}/user`, {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          // Set user info if logged in
          setUserName(data.name);
          setUserEmail(data.email);
          setUserPicture(data.picture)
          setusedStorageinBytes(data.usedStorageinBytes)
          setmaxStorageinBytes(data.maxStorageinBytes)
          setUserRole(data.role)
          setLoggedIn(true);
        } else if (response.status === 401) {
          // User not logged in
          setUserName("Guest User");
          setUserEmail("guest@example.com");
          setLoggedIn(false);
        }
        else {
          // Handle other error statuses if needed
          console.error("Error fetching user info:", response.status);
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    }
    fetchUser();
  }, [BASE_URL]);


  return (
    <>
      {/* Header */}
      <header className="navbar">
        <div className="logo-section">
          <div className="logo-box">☁</div>
          <h2 className="brand-name">Quickdrive</h2>
        </div>

        <div className="nav-actions">
          <div className="nav-btn">
            <MdSubscriptions />
            <Link to="/subscriptions" className="link">Subscriptions</Link>
          </div>

          <div className="nav-btn">
            <MdAccountBox />
            <Link to="/profile" className="link">Profile</Link>
          </div>
          {userRole !== "user" &&
            <div className="nav-btn">
              <FaUser />
              <Link to="/users" className="link">Users</Link>
            </div>
          }

          <div className="profile-section">
            <div className="profile-info">
              <span className="profile-name">{userName}</span>
              <span className="profile-email">{userEmail}</span>
              {userRole !== "user" &&
                <span className="profile-role">({userRole})</span>
              }
            </div>

            <div>
              <button
                className="icon-button"
                title="User Menu"
              // onClick={handleUserIconClick}
              // disabled={disabled}
              >
                {userPicture ? (
                  <img className="userPicture" src={userPicture} alt={userName} />
                ) : (
                  <FaUser />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default DirectoryHeader;
