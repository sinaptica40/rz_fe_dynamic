import React from "react";

const LoginButtonElement =({areas})=>{
    const name = areas.element_data.block_name
    return(
        <>
           {name}
        </>
    )
}

export default LoginButtonElement