import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Select from "react-select";

const EditElement17 = ({
  areas,
  formData,
  handleSelectNormeListing,
  normeListing,
  normeOptions,
  customDropDownData,
}) => {
  const { element_data } = areas;
  const [opts, setOpts] = useState([]);

  useEffect(() => {
    if (normeListing.length !== 0) {
      const options = normeListing?.map((item) => {
        return {
          label: item?.name,
          value: item?.id_standard,
        };
      });

      setOpts(options);
    }
  }, [normeListing]);

  return (
    <>
      <div className="form-floating">
        {formData?.norm?.length && !customDropDownData ? (
          <>
            <input
              className="form-control"
              id="floatingInput"
              autoComplete="off"
              value={
                formData?.norm?.length
                  ? formData?.norm?.map((item) => item?.name)
                  : ""
              }
            />

            <label htmlFor="floating-select">{element_data.block_name}</label>
          </>
        ) : (
          <>
            <Select
              id="floatingSelect"
              name="norm_specification"
              value={normeOptions}
              onChange={(selectedOption) => {
                handleSelectNormeListing(selectedOption);
              }}
              options={opts}
              isMulti
              classNamePrefix="react-select"
              className="form-select form-control"
            />
            <label htmlFor="floating-select">{element_data.block_name}</label>
          </>
        )}
      </div>
    </>
  );
};

export default EditElement17;
