import React from "react";

const FormArea16 = ({ children }) => {
    return (
        <>
            <div className="col-md-6">
                <div className="form-floating">
                        {children}
                </div>
            </div>
        </>
    )
}

export default FormArea16;