import React from "react";
import { useNavigate } from "react-router-dom";

const ImageElement = ({ api, areas }) => {
    const navigate = useNavigate();
    const handleClick = (id_page) => {
        navigate(`${id_page}`);
    };

    return (
        <>
            <img src={areas?.element_data?.data?.html_name} alt="" width={'88px'} height={'88px'} style={{ margin: '1em auto .6em', cursor: "pointer" }} onClick={() => handleClick(api?.function_name)} />
        </>
    )
};

export default ImageElement;
