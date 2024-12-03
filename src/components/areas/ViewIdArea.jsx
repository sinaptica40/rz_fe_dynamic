import React from "react";

const ViewIdArea = ({ children }) => {
    return (
        <>
            <div className="ispezione-detaBox">
                {/* <h3 className="ispezione-no">C124_0001_22_26_A</h3> */}
                { children }
            </div>
        </>
    )
}

export default ViewIdArea;