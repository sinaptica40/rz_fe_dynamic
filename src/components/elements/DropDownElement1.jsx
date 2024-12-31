import React from 'react';

function DropDownElement1({ areas, formValues,standardData,errors, handleChange }) {
    let { element_data } = areas;
    return (
        <>
            <select
                className="form-select form-control"
                id="floatingSelect"
                aria-label="Floating label select example"
                value={ formValues.id_standard_type} 
                onChange={handleChange}
                name="id_standard_type"
            >
                <option value="">Select</option>
               {standardData?.data.map((item)=>(
                <option value={item?.id_standard_type}>{`${item.type} (${item?.focus})`}</option>
               ))}
            </select>
            {errors.id_standard_type && (
                <div className="error-message text-danger">
                  {errors.id_standard_type}
                </div>
              )}
            <label htmlFor="floatingSelect">{element_data.block_name}</label>
        </>
    );
}

export default DropDownElement1;
