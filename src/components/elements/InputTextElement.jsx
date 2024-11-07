import React from "react";

const InputTextElement = ({areas}) => {
    let { element_data } = areas;
    return (
        <>
            <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder={element_data.block_name}
                defaultValue={`Inserire ${element_data.block_name}`}
            />
            <label htmlFor="floatingInput">{element_data.block_name}</label>
        </>
    )
}
export default InputTextElement