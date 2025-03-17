import React from "react";

const UserNameElement = ({areas, userData, handleChange}) => {

    return (
        <div className="col-md-6">
        <div className="form-floating">
            <input
                type="text"
                className="form-control"
                id="floatingInput"
                value={ userData?.username ?? ""}
                // placeholder={areas?.element_data.block_name}
                onChange={handleChange}
                name="username"
            />
            <label htmlFor="floatingInput">{areas?.element_data.block_name}</label>
            </div>
        </div>
    )
}
export default UserNameElement