import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const ProfileElement = ({ areas, userDetails }) => {
    const isCheck = localStorage.getItem('check')
    const navigate = useNavigate();
    const handleLogout = () => {
        if(isCheck){
            localStorage.clear()
            sessionStorage.clear()
        }else{
            sessionStorage.clear()
            localStorage.clear()
        }
        navigate('/login')
    }

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
                <img src={userDetails?.data?.image} alt="" />
                <div className="userHeaderName d-none d-lg-block">
                    {userDetails?.data?.username}
                </div>
            </a>
                <div className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`} aria-labelledby="user-drop">
                    <div className="user_info">
                        <div className="user_name d-block d-lg-none">
                            <div> {userDetails?.data?.username}</div>
                            <div className="user_email">
                                <small> {userDetails?.data?.mail}</small>
                            </div>
                        </div>
                        <ul>
                            <li className="cursor-pointer">
                                <a onClick={() => navigate('/profile')}>
                                    <i className="ion-android-person" /> My Profile
                                </a>
                            </li>
                            <li className="cursor-pointer">
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
