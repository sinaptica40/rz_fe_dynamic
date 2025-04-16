import React from "react";
import { useNavigate } from "react-router-dom";

const NotifyElement = (props) => {
    const navigate = useNavigate();
    const handleNavigate = () =>{
        navigate(`/${10}`)
    }
    return (
        <>
        <div className="right_notfiMenu">
            <a className="nav-link" onClick={handleNavigate}>
                <span className="header_menuIcon">
                    <img src={props?.areas?.element_data?.interaction_name} />
                </span>
                Notifiche
            </a>
            </div>
        </>
    )
};

export default NotifyElement;
