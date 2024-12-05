import React from 'react'
import CreatableSelect from "react-select/creatable";

const EditElement13 = ({ areas, machineTypology,topologyName, handleSelectMachineryTopology, formData,errors }) => {
  const { element_data } = areas;
  const defaultOption = machineTypology?.find(machine => machine?.typology === formData?.typology);

  // console.log("formData?.typology",formData?.typology)
  return (
    <>

      <CreatableSelect
        id="floatingSelect"
        name="typology"
        onChange={handleSelectMachineryTopology}
        defaultValue={{ label: defaultOption?.typology }}
        value={{label:topologyName}}
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

      {/* {errors.machineId && (
                <div className="error-message text-danger">
                  {errors.machineId}
                </div>
              )} */}

      <label htmlFor="floating-select">{element_data.block_name}</label>


    </>
  )
}

export default EditElement13;