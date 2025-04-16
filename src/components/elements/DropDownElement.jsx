import React from "react";

const DropDownElement = ({ areas, standardData, formValues, handleChange }) => {
  let { element_data } = areas;
  return (
    <>
      <select
        className="form-select form-control"
        id="floatingSelect"
        aria-label="Floating label select example"
        value={formValues ? formValues?.id_standard_type : ""}
        onChange={handleChange}
        name="id_standard_type"
      >
        {standardData?.data.map((item) => (
          <option value={item?.id_standard_type} selected>
            {`${item?.type} (${item?.focus})`}
          </option>
        ))}
      </select>
      <label htmlFor="floatingSelect">{element_data.block_name}</label>
    </>
  );
};

export default DropDownElement;
