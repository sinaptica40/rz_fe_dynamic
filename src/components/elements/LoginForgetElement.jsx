import React from "react";
const LoginForgetElement = ({areas, ModelOpen}) => {
    const name = areas.element_data.block_name
    return (
        <>
            <a onClick={ModelOpen} className="forget_pass" style={{cursor: "pointer"}}>
                {name}
            </a>
        </>
    )
}

export default LoginForgetElement