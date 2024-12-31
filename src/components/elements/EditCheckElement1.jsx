import React from "react";

const EditCheckElement1 = ({ areas, handleChange, formValues }) => {
    const name = areas.element_data.block_name
    return (
        <>
            <label
                className="form-check-label custom-control-label"
                htmlFor={name}
            >
                {name}
            </label>
            <input type="checkbox"
                checked={formValues?.ce}
                name="ce"
                onChange={handleChange}
                className="form-check-input"
                id={name} />
        </>
    )
}

export default EditCheckElement1