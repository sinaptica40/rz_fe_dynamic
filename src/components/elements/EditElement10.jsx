
import React from 'react'
import Select from "react-select";
const EditElement10 = ({areas,workingListing,handleSelectArea,formData})=>{
    const {element_data} = areas;
    console.log(formData,"formData")
    return(
        <>
          
            <div
            //   className={`form-floating ${isSelectActive ? "active-floating-select" : ""
            //     }`}
             className="form-floating"
             >
              <Select
                id="floatingSelect"
                name="areaId"
                onChange={handleSelectArea}
                defaultValue={formData?.arealavoe_defaultvalue}
                options={workingListing?.map((item)=>{
                  return{
                    areaId:item?.id_working_area,
                    value:item?.wa_name,
                    label:item?.wa_name,
                  }
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
              
            </div>
          
        </>
    )
}

export default EditElement10;