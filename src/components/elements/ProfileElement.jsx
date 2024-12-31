import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const ProfileElement = ({ areas }) => {
  
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_name",);
        localStorage.removeItem("user_id");
        navigate('/login')
    }

    const userName = localStorage.getItem("user_name")
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setDropdownOpen(prevState => !prevState);
    };
    return (
        <>
            <div className={`user_dropdown ${isDropdownOpen ? 'show' : ''}`}>
            <a
                className="nav-link profileDropHeader dropdown-toggle"
                href="javascript:void(0);"
                id="user-drop"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen ? 'true' : 'false'}
                onClick={toggleDropdown}
            >
                <img src="img/header_user.png" alt="" />
                <div className="userHeaderName d-none d-lg-block">
                    {userName}
                </div>
            </a>
                <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="user-drop">
                    <div className="user_info">
                        <div className="user_name d-block d-lg-none">
                            <div>Alex Willson</div>
                            <div className="user_email">
                                <small>alexwillson@gmail.com</small>
                            </div>
                        </div>
                        <ul>
                            <li>
                                <a href="#!">
                                    <i className="ion-android-person" /> My Profile
                                </a>
                            </li>
                            <li>
                                <a
                                    onClick={handleLogout}
                                // href="#!"
                                >
                                    <i className="ion-log-out" /> Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
};

export default ProfileElement;
