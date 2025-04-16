import React from "react";

const FullNameElement = ({areas, userData, handleChange}) => {

    return (
        <div className="col-md-6">
        <div className="form-floating">
            <input
                type="text"
                className="form-control"
                id="floatingInput"
                value={userData?.fullname ?? ""}
                onChange={handleChange}
                name="fullname"
            />
            <label htmlFor="floatingInput">{areas?.element_data.block_name}</label>
            </div>
        </div>
    )
}
export default FullNameElement