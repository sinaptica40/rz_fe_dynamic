import React from "react";
const LoginCheckElement = ({areas}) => {
    const name = areas.element_data.block_name
    return (
        <>
            <input type="checkbox" class="form-check-input" id="brand1"/>
            <label className="form-check-label custom-control-label" htmlFor="brand1">
                {/* Ricorda le credeziali */}
                {name}
            </label>
        </>
    )
}

export default LoginCheckElement