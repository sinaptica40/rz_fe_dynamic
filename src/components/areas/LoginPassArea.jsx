import React from "react";

const LoginPassArea = ({children}) => {
    return (
        <>
            <div className="form-floating position-relative mb-4">
                {/* <input type="password" name="password" className="form-control" id="password-field" placeholder="Password" />
                <label htmlFor="password-field">Password</label>
                <span toggle="#password-field" className="fa fa-fw fa-eye pass-icon toggle-password" /> */}
                {children}
            </div>
        </>
    )
}

export default LoginPassArea