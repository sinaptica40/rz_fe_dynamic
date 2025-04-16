import React from "react";
import Select from "react-select";
const EditElement10 = ({
  areas,
  workingListing,
  handleSelectArea,
  formData,
  errors,
}) => {
  const { element_data } = areas;

  const options = workingListing?.map((item) => {
    return {
      areaId: item?.id_working_area,
      value: item?.wa_name,
      label: item?.wa_name,
    };
  });

  const defaultValue = options?.find(
    (option) => option.areaId === formData?.areaId
  );

  return (
    <>
      <div className="form-floating">
        <Select
          id="floatingSelect"
          name="areaId"
          onChange={handleSelectArea}
          defaultValue={formData?.arealavoe_defaultvalue}
          value={{ label: defaultValue?.value }}
          options={options}
          classNamePrefix="react-select"
          className="form-select form-control"
        />
        {errors.areaId && (
          <div className="error-message text-danger">{errors.areaId}</div>
        )}
        <label htmlFor="floating-select">{element_data.block_name}</label>
      </div>
    </>
  );
};

export default EditElement10;
