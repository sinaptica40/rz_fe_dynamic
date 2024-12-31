import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';

const MenuElement = ({ data }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const route = location.pathname.substring(1) || '/';

    return (
        <>
            <button className="navbar-toggler menuClose-icon" type="button">
                <svg
                    width={14}
                    height={14}
                    viewBox="0 0 14 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
                        fill="black"
                    />
                </svg>
            </button>
            <ul className="navbar-nav ms-auto">
                {data.data.map((item) => {
                    return (
                        <li className={`nav-item ${route == item.id_page ? "active" : ""}`}>
                            <a className="nav-link" onClick={() => navigate(`/${item.id_page}`)}>
                                <span className="header_menuIcon">
                                    <img src={item?.image_icon} />
                                </span>
                                {item.menu_item_name}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </>
    )
};

export default MenuElement;
