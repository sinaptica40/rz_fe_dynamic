import React from "react";

const LoginPassElement = ({areas}) => {
    const name = areas.element_data.block_name
    return (
        <>
            <input type="password" name="password" className="form-control" id="password-field" placeholder="Password" />
            <label htmlFor="password-field">{name}</label>
            <span toggle="#password-field" className="fa fa-fw fa-eye pass-icon toggle-password" />
        </>
    )
}
export default LoginPassElement