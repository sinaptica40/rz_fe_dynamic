import React from 'react'
import CreatableSelect from "react-select/creatable";


const EditElement9 = ({areas,formValues,formData,ispectorListing,handleSelectIspector,errors})=>{
    const {element_data} = areas;
    const defaultOption = ispectorListing?.find(machine => machine?.name === formValues);
    console.log("defaultOption",defaultOption);
    return(
        <>
      
            <div
            //   className={`form-floating ${isSelectActive ? "active-floating-select" : ""
            //     }`}
             className="form-floating"
             >
              <CreatableSelect
                id="floatingSelect"
                name="inspectorId"
                defaultValue={{label:defaultOption?.name,value: defaultOption?.name}}
               // value={formData?.inspectorId ? { value: formData.inspectorId.value, label: formData.inspectorId.label } : null}
                // value = {formData?.inspectorId ? {value :formValues , label : formValues}: null}
                onChange={handleSelectIspector}
                options={
                  ispectorListing.map((item)=>{
                  return{
                    inspectorId:item?.id_ispector,
                    value: item?.name,
                    label: item?.name,
                  }
                 })
                }
                classNamePrefix="react-select"
                className="form-select form-control"
             />
              {/* {errors.inspectorId && (
                <div className="error-message text-danger">
                  {errors.inspectorId}
                </div>
              )} */}
              
              <label htmlFor="floating-select">{element_data.block_name}</label>
              
            </div>
         
        </>
    )
}

export default EditElement9;