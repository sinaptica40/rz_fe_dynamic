import React from "react";

const LoginButtonArea = ({ children }) => {
    // console.log("children-children",children)
    return (
        <>
            <button type="submit" class="btn-primary btn-login" onclick="document.location='index.html'">
                {children}
            </button>
        </>
    )
}

export default LoginButtonArea



