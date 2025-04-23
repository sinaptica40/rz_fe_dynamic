import React from "react";
import { useLocation, useNavigate } from 'react-router-dom';
const MenuElement = ({ areas, data }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const route = location.pathname.substring(1) || '/';
    const handleNavigation = (id_page) =>{
        localStorage.removeItem('formId')
        sessionStorage.removeItem('subIndex')
        sessionStorage.removeItem('inspectId')
        sessionStorage.removeItem('sezione')
        sessionStorage.removeItem('menuindex')
        sessionStorage.setItem('navlink',0)
        navigate(`/${id_page.toLowerCase()}`)
    }
    
    function getParentPageName(key) {
        
        // Get navigation array from localStorage 
        const pages = JSON.parse(localStorage.getItem('navPages'));
    
        // Find the matching page
        const matchedPage = pages?.find(page => page.page_name_label === key);
    
        // Ensure parent_page_name is not undefined before calling toLocaleLowerCase()
        return matchedPage?.parent_page_name ? matchedPage.parent_page_name.toLocaleLowerCase() : null;
    }
    

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
                {data?.data?.map((item,index) => {
                    return (
                        <li key={index} style={{cursor: "pointer"}} className={`nav-item ${route?.toLocaleLowerCase() == item?.menu_item_name?.toLowerCase() || getParentPageName(route?.toLocaleLowerCase()) == item?.menu_item_name?.toLocaleLowerCase() ? "active" : ""}`}>
                            <a className="nav-link" onClick={() => handleNavigation(item?.menu_item_name)}>
                                <span className="header_menuIcon">
                                    <img src={item?.image_icon} />
                                </span>
                                {item?.menu_item_name}
                            </a>
                        </li>
                    )
                })}
            </ul>
        </>
    )
};

export default MenuElement;
