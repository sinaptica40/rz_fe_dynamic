import React from 'react'
import CreatableSelect from "react-select/creatable";

const EditElement9 = ({ areas, formData, formValues, ispectorListing, handleSelectIspector, errors }) => {
  const { element_data } = areas;
  console.log(formValues,"formvalue",formData,'check form vlaue id of inspectior')
  const defaultOption = ispectorListing?.find(machine => machine?.id_ispector === formValues);
  return (
    <>
      <div
        className="form-floating"
      >
        <CreatableSelect
          id="floatingSelect"
          name="inspectorId"
          value={{ label: defaultOption?.name, value: defaultOption?.name }}
          onChange={handleSelectIspector}
          options={
            ispectorListing.map((item) => {
              return {
                inspectorId: item?.id_ispector,
                value: item?.name,
                label: item?.name,
              }
            })
          }
          classNamePrefix="react-select"
          className="form-select form-control"
        />
        <label htmlFor="floating-select">{element_data.block_name}</label>
      </div>
    </>
  )
}

export default EditElement9;