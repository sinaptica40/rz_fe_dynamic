import React from "react";

const ViewArea1 = ({ children }) => {
    return (
        <>
            <div className="col-md-4">
                <div className="form-floating">
                    {children}
                </div>
            </div>
        </>
    )
}

export default ViewArea1