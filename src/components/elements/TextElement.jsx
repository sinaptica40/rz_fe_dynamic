import React from "react";

const TextElement = ({ areas }) => {
    let { element_data } = areas;
    return (
        <>
            {element_data?.data?.html_name ?? 'C124_0001_22_26_A' }
        </>
    )
}

export default TextElement;