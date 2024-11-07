import React from "react";

const EditCheckElement1 = ({areas}) => {
    const name = areas.element_data.block_name
    return (
        <>
            <label
                className="form-check-label custom-control-label"
                htmlFor={name}
            >
                {name}
            </label>
            <input type="checkbox" className="form-check-input" id={name} />
        </>
    )
}

export default EditCheckElement1