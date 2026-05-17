import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UsersPage.css";

export default function UsersPage() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState("Guest User");
  const [userRole, setuserRole] = useState("");

  const navigate = useNavigate();

  const logoutUser = async (user) => {
    const confirmLogout = confirm(`You are about to logout ${user.email}`)
    if(!confirmLogout) return
    try {
      const response = await fetch(`${BASE_URL}/user/${user._id}/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        fetchAllUsers()
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const deleteUser = async(user,type)=>{
     const confirmLogout = confirm(`You are about to DELETE ${user.email}`)
    if(!confirmLogout) return
    try {
      const response = await fetch(`${BASE_URL}/user/${user._id}/${type}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        fetchAllUsers()
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  useEffect(() => {
    fetchAllUsers();
    fetchUser();
  }, []);

  // fetch login user
  async function fetchUser() {
    try {
      const response = await fetch(`${BASE_URL}/user`, {
        credentials: "include",
      });
      if (response.status === 401) return navigate("/")
      else {
        const data = await response.json();
        if (data.role === "user") return navigate("/")
        setUserName(data.name);
        setuserRole(data.role);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  }

  // fetch all users
  async function fetchAllUsers() {
    try {
      const response = await fetch(`${BASE_URL}/users`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        // console.log(data);
      } else {
        // Handle other error statuses if needed
        console.error("Error fetching users data", response.status);
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
    }
  }

  return (
    <div className="users-container">
      <h1 className="title">All Users</h1>
      <div className="user-info-cont">
        <h3>{userName}</h3>
        <p>({userRole})</p></div>
      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>LogOut</th>
            <th>Soft Delete</th>
            {(userRole === "admin") && <th>Hard Delete</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.loggedIn ? "Active" : "Inactive"}</td>
                <td>
                  <button
                    className="logout-button"
                    onClick={() => logoutUser(user)}
                    disabled={!user.loggedIn}
                  >
                    Logout
                  </button>
                </td>
                <td>
                  <button
                    className="delete-button"
                    onClick={() => deleteUser(user,"soft")}
                  >
                   Soft Delete
                  </button>
                </td>
              {(userRole === "admin") &&
                <td>
                  <button
                    className="delete-button hard"
                    onClick={() => deleteUser(user,"hard")}
                  >
                   Hard Delete
                  </button>
                </td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
