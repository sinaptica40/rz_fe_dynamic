import React from "react";

const LoginForgetArea = ({ children }) => {
    return (
        <>
                <div className="forget_passwordBox">
                    {/* <a href="forgot-password.html" className="forget_pass">
                    Recupera le credenziali
                </a> */}
                    {children}
                </div>
        </>
    )
}

export default LoginForgetArea