import React from "react";

const NotifyElement = (props) => {
    console.log("props", props)
    return (
        <>
        <div className="right_notfiMenu">
            <a className="nav-link" href="#">
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
