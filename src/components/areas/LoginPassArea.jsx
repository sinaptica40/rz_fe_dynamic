import React from "react";

const LoginPassArea = ({children}) => {
    return (
        <>
            <div className="form-floating position-relative mb-4">
                {children}
            </div>
        </>
    )
}

export default LoginPassArea