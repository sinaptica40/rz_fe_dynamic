import React from "react";

const LoginEmailElement =({areas})=>{
    const name = areas.element_data.block_name
    return(
        <>
            <input type="email" className="form-control" id="Email" placeholder="Email" />
            <label htmlFor="Email">{name}</label>
        </>
    )
}
export default LoginEmailElement