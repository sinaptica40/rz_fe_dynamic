import React from "react";

const LoginTextElement = ({areas}) => {
    return (
        <>
            <h1 className="login_title">{areas?.element_data?.data?.html_name}</h1>
        </>
    )
}

export default LoginTextElement;