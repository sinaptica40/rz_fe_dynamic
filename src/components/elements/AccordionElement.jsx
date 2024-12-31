import React from "react";
import { useNavigate } from "react-router-dom";

const AccordionElement = ({ data }) => {
    const navigate = useNavigate();

    const handleClick = (id_page) => {
        navigate(`/${id_page}`);
    };

    const imageIcon = data?.data[0]?.image_icon;

    return (
        <>
            <ul className="sideNav_menu">
                {data.data.map((item) => {
                    return (
                        <li
                            key={item.id_page}
                            className="dash_nav_item"
                            onClick={() => handleClick(item.id_page)}
                        >
                            <a className="dash_navTitle">
                                <span className="icon_holder">
                                    <img src={item.image_icon} />
                                </span>
                                {item.menu_item_name}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export default AccordionElement;
