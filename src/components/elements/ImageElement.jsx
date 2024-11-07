import React from "react";
import { useNavigate } from "react-router-dom";

const ImageElement = ({api}) => {
    const navigate = useNavigate();
    const handleClick = (id_page) => {
        navigate(`${id_page}`); 
    };

    return (
        <>
            <img src="img/logo.png" alt="" onClick={() => handleClick(api?.function_name)}/>
        </>
    )
};

export default ImageElement;
