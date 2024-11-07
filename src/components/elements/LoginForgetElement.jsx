import React from "react";
const LoginForgetElement = ({areas}) => {
    const name = areas.element_data.block_name
    return (
        <>
            <a href="forgot-password.html" className="forget_pass">
                {/* Recupera le credenziali */}
                {name}
            </a>
        </>
    )
}

export default LoginForgetElement