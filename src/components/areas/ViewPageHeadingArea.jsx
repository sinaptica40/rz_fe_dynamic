import React from "react";

const ViewPageHeadingArea = ({ children }) => {
    return (
        <>
            <div className="heading-bg-element mb-4">
                {/* <div className="heading-elm-itle">Inspection Item {item}</div> */}
                { children }
            </div>
        </>
    )
}

export default ViewPageHeadingArea;