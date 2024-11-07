import React from "react";

const ProfileElement = ({ areas }) => {
    return (
        <>
            <a
                className="nav-link profileDropHeader dropdown-toggle"
                href="javascript:void(0);"
                id="user-drop"
                role="button"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
            >
                <img src="img/header_user.png" alt="" />
                <div className="userHeaderName d-none d-lg-block">
                    Alex Willson
                </div>
            </a>
            <div className="dropdown-menu" aria-labelledby="user-drop">
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
                            <a href="#!">
                                <i className="ion-log-out" /> Logout
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
};

export default ProfileElement;
