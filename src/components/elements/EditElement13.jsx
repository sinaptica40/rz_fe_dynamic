import React from 'react'
import CreatableSelect from "react-select/creatable";

const EditElement13 = ({ areas, machineTypology, topologyName, handleSelectMachineryTopology, formData, errors }) => {
  const { element_data } = areas;
  const defaultOption = machineTypology?.find(machine => machine?.typology === formData?.typology);

  return (
    <>
      <CreatableSelect
        id="floatingSelect"
        name="typology"
        onChange={handleSelectMachineryTopology}
        defaultValue={{ label: defaultOption?.typology }}
        value={{ label: topologyName }}
        options={machineTypology?.map((machine) => {
          return {
            value: machine?.typology,
            label: machine?.typology,
          };
        })}
        classNamePrefix="react-select"
        className="form-select form-control"
      />
      <label htmlFor="floating-select">{element_data.block_name}</label>
    </>
  )
}

export default EditElement13;