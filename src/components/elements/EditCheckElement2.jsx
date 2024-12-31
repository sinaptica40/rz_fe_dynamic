import React from "react";

const EditCheckElement2 = ({ areas, handleChange, formValues }) => {
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
                checked={formValues?.atex}
                name="atex" onChange={handleChange} className="form-check-input" id={name} />
        </>
    )
}

export default EditCheckElement2;