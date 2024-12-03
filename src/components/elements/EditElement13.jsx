import React from 'react'
import Select from "react-select";

const EditElement13 = ({ areas, machineTypology, handleSelectMachineryTopology, formData }) => {
  const { element_data } = areas;
  const defaultOption = machineTypology?.find(machine => machine?.typology === formData?.typology);
  return (
    <>

      <Select
        id="floatingSelect"
        name="typology"
        onChange={handleSelectMachineryTopology}
        defaultValue={{ label: defaultOption?.typology }}
        options={machineTypology?.map((machine) => {
          return {
            //  id_machinery_type:machine?.id_machinery_type,
            value: machine?.typology,
            label: machine?.typology,
          };
        })}
        classNamePrefix="react-select"
        className="form-select form-control"
      />

      {/* {errors.norm_specification && (
                <div className="error-message text-danger">
                  {errors.norm_specification}
                </div>
              )} */}

      <label htmlFor="floating-select">{element_data.block_name}</label>


    </>
  )
}

export default EditElement13;