import { FaSignInAlt, FaSignOutAlt, FaUser } from "react-icons/fa";

import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";

import "./AdminDashboard.css"
import DirectoryHeader from "./components/DirectoryHeader";

const AdminDashboard = () => {
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const [users, setUsers] = useState([]);
    const [userName, setUserName] = useState("Guest User");
    const [userRole, setuserRole] = useState("");

    const navigate = useNavigate();

    const logoutUser = async (user) => {
        const confirmLogout = confirm(`You are about to logout ${user.email}`)
        if (!confirmLogout) return
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

    const deleteUser = async (user, type) => {
        const confirmLogout = confirm(`You are about to DELETE ${user.email}`)
        if (!confirmLogout) return
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
        <>
        {/* Header */}
        <DirectoryHeader />

        {/* Content */}
        <div className="dashboard">
            {/* Header */}

            {/* User Profile Banner */}
            <div className="profile-banner">
                <Link to="/" className="link">← Back</Link>

                <div className="banner-user">
                    <h3>{userName}</h3>

                    <span className="role-badge">({userRole})</span>
                </div>
            </div>

            {/* Table */}
            <div className="table-section">
                <div className="table-header">
                    <div>
                        <h3>User Management</h3>
                        <span>Total users: {users.length} </span>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Actions</th>
                            {(userRole === "admin") && <th>Hard Delete</th>}
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user, idx) => (
                            <tr key={idx}>
                                <td>
                                    <div className="user-info">
                                        <div className="avatar-small">
                                            <img src={user.picture} alt="user" />
                                        </div>

                                        <div>
                                            <h4>{user.name}</h4>
                                            <p>{user.email}</p>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <span className="role-pill">{user.role}</span>
                                </td>

                                <td>
                                    <span
                                        className={user.loggedIn ? "status online" : "status offline"}
                                    >
                                        {user.loggedIn ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                <td>
                                    <div className="actions">
                                        <button
                                            className="logout-btn"
                                            onClick={() => logoutUser(user)}
                                            disabled={!user.loggedIn}
                                        >
                                            Logout
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => deleteUser(user, "soft")}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                                {(userRole === "admin") && <td>
                                    <button
                                        className="hard-delete-btn"
                                        onClick={() => deleteUser(user, "hard")}
                                    >
                                        Delete
                                    </button>
                                </td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};

export default AdminDashboard;