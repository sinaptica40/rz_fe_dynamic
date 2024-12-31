import React from "react";

const LoginEmailArea = ({children}) => {
   
    return (
        <>
            <div className="form-floating">
                {children}
            </div>
        </>
    )
}

export default LoginEmailArea;