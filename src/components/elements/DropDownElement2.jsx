import React from 'react'
import Select from "react-select";
function DropDownElement2({ areas, formValues, handleSelectChange, errors, normeOptions, selectedOption, isSelectActive }) {
  let { element_data } = areas;

  return (
    <div className="col-md-6">
      <div
        className={`form-floating ${isSelectActive ? "active-floating-select" : ""
          }`}
        style={{ borderBottom: 'none' }}
      //className="form-floating"
      >
        <Select
          id="floatingSelect"
          name="norm_specification"
          value={selectedOption}
          onChange={handleSelectChange}
          options={normeOptions}
          isMulti
          classNamePrefix="react-select"
          className="form-select form-control"
        />
        {errors.norm_specification && (
          <div className="error-message text-danger">
            {errors.norm_specification}
          </div>
        )}

        <label htmlFor="floating-select">{element_data.block_name}</label>

      </div>
     </div>
  )
}

export default DropDownElement2