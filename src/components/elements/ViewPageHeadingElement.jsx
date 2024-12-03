import React from "react";

const ViewPageHeadingElement = ({ areas,item }) => {
    let { element_data } = areas;
    return (
        <>
            <div className="heading-elm-itle">Inspection Item {item}</div>
        </>
    )
}

export default ViewPageHeadingElement;