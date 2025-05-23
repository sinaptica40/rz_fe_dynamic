import React from "react";
import { useNavigate } from "react-router-dom";

const MachineryElement1 = ({ api, areas, data }) => {
    const navigate = useNavigate();
    const handleClick = (id_page) => {
        navigate(`${id_page}`); 
    };

    return (
        <>
            <a style={{cursor: "pointer"}} onClick={() => handleClick(api?.function_name)} className="dash_navTitle">
                <span className="icon_holder">
                    <img src={data?.image_icon} />
                </span>
                {data?.data[0]?.menu_item_name}
            </a>
        </>
    )
}

export default MachineryElement1