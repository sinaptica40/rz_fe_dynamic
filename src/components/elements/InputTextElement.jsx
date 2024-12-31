import React from "react";

const InputTextElement = ({areas,handleChange,formValues,editNormeData}) => {

    return (
        <div className="col-md-4">
        <div className="form-floating">
            <input
                type="text"
                className="form-control"
                id="floatingInput"
                value={ formValues?.standard_code ? formValues?.standard_code : ""}
                placeholder={areas?.element_data.block_name}
                onChange={handleChange}
                name="standard_code"
            />
            <label htmlFor="floatingInput">{areas?.element_data.block_name}</label>
            </div>
        </div>
    )
}
export default InputTextElement