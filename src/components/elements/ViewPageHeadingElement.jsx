import React from "react";

const ViewPageHeadingElement = ({ areas ,index }) => {

    console.log("areas==",areas)
    return (
        <>
           {areas?.element_data?.block_name} {index + 1}
        </>
    )
}

export default ViewPageHeadingElement;