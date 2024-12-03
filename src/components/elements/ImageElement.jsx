import React from "react";
import { useNavigate } from "react-router-dom";

const ImageElement = ({api,areas}) => {
    console.log("areas",areas)
    const navigate = useNavigate();
    const handleClick = (id_page) => {
        navigate(`${id_page}`); 
    };

    return (
        <>
            <img src={areas?.element_data?.data?.html_name} alt="" onClick={() => handleClick(api?.function_name)}/>
            
        </>
    )
};

export default ImageElement;
