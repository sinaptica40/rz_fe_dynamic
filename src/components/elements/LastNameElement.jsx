import React from "react";

const LastNameElement = ({areas, userData, handleChange}) => {
    return (
        <div className="col-md-12">
        <div className="form-floating">
            <input
                type="text"
                className="form-control"
                id="floatingInput"
                value={ userData?.surname ?? ""}
                onChange={handleChange}
                name="surname"
            />
            <label htmlFor="floatingInput">{areas?.element_data.block_name}</label>
            </div>
        </div>
    )
}
export default LastNameElement