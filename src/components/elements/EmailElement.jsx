import React from "react";

const EmailElement = ({areas, userData, handleChange}) => {

    return (
        <div className="col-md-6">
        <div className="form-floating">
            <input
                type="email"
                className="form-control"
                id="floatingInput"
                value={ userData?.email ?? ""}
                name="email"
            />
            <label htmlFor="floatingInput">{areas?.element_data.block_name}</label>
            </div>
        </div>
    )
}
export default EmailElement