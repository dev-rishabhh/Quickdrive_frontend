import React, { useEffect, useState } from "react";
import { FaHardDrive, FaRegUser } from "react-icons/fa6";
import { FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import "./ProfileDashboard.css";
import DirectoryHeader from "./DirectoryHeader";

const ProfileDashboard = () => {

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const [userName, setUserName] = useState("Guest User");
    const [userEmail, setUserEmail] = useState("guest@example.com");
    const [userPicture, setUserPicture] = useState();
    const [usedStorageinBytes, setusedStorageinBytes] = useState(0);
    const [maxStorageinBytes, setmaxStorageinBytes] = useState(0);

    const navigate = useNavigate()

    const usedGB = (usedStorageinBytes / 1024 ** 3).toFixed(2)
    const totalGB = maxStorageinBytes / 1024 ** 3

    const percentage = ((usedGB / totalGB) * 100).toFixed(2);
    const availableStorage = (totalGB - usedGB).toFixed(2);

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
                } else if (response.status === 401) {
                    // User not logged in
                    navigate("/login")
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
    }, []);

    // 3. Logout handler
    // -------------------------------------------
    const handleLogout = async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/logout`, {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                // console.log("Logged out successfully");
                // Optionally reset local state
                // setLoggedIn(false);
                setUserName("Guest User");
                setUserEmail("guest@example.com");
                navigate("/login");
            } else {
                console.error("Logout failed");
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };
    // -------------------------------------------
    // 3. Logout-All handler
    // -------------------------------------------
    const handleLogoutAll = async () => {
        try {
            const response = await fetch(`${BASE_URL}/user/logout-all`, {
                method: "POST",
                credentials: "include",
            });
            if (response.ok) {
                // console.log("Logged out successfully");
                // Optionally reset local state
                // setLoggedIn(false);
                setUserName("Guest User");
                setUserEmail("guest@example.com");
                navigate("/login");
            } else {
                console.error("Logout failed");
            }
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    return (
        <>
            {/* Header */}
            <DirectoryHeader />

            {/* Content */}
            <div className="user-page">
                {/* STORAGE CARD */}
                <div className="card">
                    <div className="card-title">
                        <FaHardDrive />
                        <h3> Storage Usage</h3>
                    </div>

                    <div className="storage-top">
                        <div>
                            <p>
                                {usedGB} GB of {totalGB} GB used
                            </p>

                            <p className="warning-text">⚠ Storage is nearly full</p>
                        </div>

                        <div className="usage-badge">{percentage}% used</div>
                    </div>

                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>

                    <div className="storage-stats">
                        <div className="stat-box">
                            <span>Used Space</span>
                            {usedGB} GB
                        </div>

                        <div className="stat-box">
                            <span>Available Space</span>
                            {availableStorage} GB
                        </div>
                    </div>
                </div>

                {/* PROFILE SETTINGS */}
                <div className="card">
                    <div className="card-title">
                        <FaRegUser />
                        <h3>Profile Settings</h3>
                    </div>

                    <div className="profile">
                        <p className="section-title">Profile Picture</p>
                        <div className="profile-upload">
                            <img
                                src={userPicture}
                                alt="Profile"
                                className="profile-image"
                            />
                        </div>
                    </div>

                    {/* FORM */}
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" value={userName} readOnly />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            value={userEmail}
                            readOnly
                        />
                    </div>
                </div>

                {/* Logout card */}
                <div className="card">
                    <div className="card-title">
                        <FaSignOutAlt />
                        <h3> Logout</h3>
                    </div>

                    <div className="logout-card">

                        {/* card 1 */}
                        <div className="logout-card-container">
                            <div className="logout-info-container">
                                <span className="logout-icon-container">
                                    <FaSignOutAlt />
                                </span>
                                <div className="logout-text-container">
                                    <p className="logout-device">Current Device</p>
                                    <p className="logout-para">Logout from this device only</p>
                                </div>
                            </div>
                            <button
                                className="logout-card-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>

                        {/* card 2 */}
                        <div className="logout-card-container">
                            <div className="logout-info-container">
                                <span className="logout-all-icon-container">
                                    <FaSignOutAlt />
                                </span>
                                <div className="logout-text-container">
                                    <p className="logout-device">All Devices</p>
                                    <p className="logout-para">Logout from all devices</p>
                                </div>
                            </div>
                            <button
                                className="logout-all-card-btn"
                                onClick={handleLogoutAll}
                            >
                                Logout All
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ProfileDashboard;