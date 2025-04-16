import React from "react";
import CreatableSelect from "react-select/creatable";

const EditElement7 = ({
  areas,
  normeDellData,
  handleSelectMachinery,
  formData,
  errors,
}) => {
  const name = areas.element_data.block_name;

  const options = normeDellData?.data?.map((item) => ({
    id_machinery_type: item?.id_machinery_type,
    value: item?.name,
    label: item?.name,
  }));

  const currentValue = options?.find(
    (option) => option.id_machinery_type === formData?.machineId
  );
  const selectedValue = formData?.normedefaultValue
    ? {
        label: formData?.normedefaultValue?.label,
        value: formData?.normedefaultValue?.value,
      }
    : null;

  return (
    <>
      <CreatableSelect
        id="floatingSelect"
        name="machineId"
        onChange={handleSelectMachinery}
        value={
          formData?.machineName
            ? formData?.machineName
            : currentValue
            ? currentValue ?? {}
            : selectedValue
            ? selectedValue
            : ""
        }
        options={options}
        classNamePrefix="react-select"
        className="form-select form-control"
      />
      <label htmlFor="floatingSelect">{name}</label>
      {errors?.topology && (
        <div className="error-message text-danger">{errors?.topology}</div>
      )}
    </>
  );
};

export default EditElement7;
