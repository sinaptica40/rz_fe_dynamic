import React from "react";

const CardImageElement = ({ areas, data }) => {
    const name = areas?.table_name;

    return (
        <>
            <img src={areas?.element_data?.data?.html_name} />
        </>
    )
};

export default CardImageElement;
