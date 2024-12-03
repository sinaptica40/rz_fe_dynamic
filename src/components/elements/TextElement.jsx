import React from "react";

const TextElement = ({ areas }) => {
    let { element_data } = areas;
    return (
        <>
            {/* <h3 className="ispezione-no"> {element_data?.data?.html_name}</h3> */}
            <h3 className="ispezione-no" style={{fontSize:"24px",fontWeight:"600"}} > {element_data?.data?.html_name}</h3>
        </>
    )
}

export default TextElement;