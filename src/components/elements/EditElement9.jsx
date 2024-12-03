import React from 'react'
import Select from "react-select";
const EditElement9 = ({areas,formValues,formData,ispectorListing,handleSelectIspector})=>{
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
              <Select
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
              {/* {errors.norm_specification && (
                <div className="error-message text-danger">
                  {errors.norm_specification}
                </div>
              )} */}
              
              <label htmlFor="floating-select">{element_data.block_name}</label>
              
            </div>
         
        </>
    )
}

export default EditElement9;