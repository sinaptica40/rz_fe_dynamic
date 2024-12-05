import React from 'react'
import CreatableSelect from "react-select/creatable";
const EditElement14 = ({areas,MachineryData,handleSelectChange,formData,errors,MachineryID})=>{
    const {element_data} = areas;
    console.log(MachineryID,"MachineryData")
    return(
        <>
         
            <div
            //   className={`form-floating ${isSelectActive ? "active-floating-select" : ""
            //     }`}
             className="form-floating"
             >
               <CreatableSelect
                id="floatingSelect"
                name="brandName"
                defaultValue={formData?.defaultValue}
                value={{label:MachineryID}}
                onChange={handleSelectChange}
                 options={MachineryData?.data?.map((item)=>{
                  return{
                  value: item?.brand_name,
                  label: item?.brand_name,
                  }
                 })}
               
                classNamePrefix="react-select"
                className="form-select form-control"
             />
              {/* {errors?.brand_name && (
                <div className="error-message text-danger">
                  {errors?.brand_name}
                </div>
              )}
               */}
              <label htmlFor="floating-select">{element_data.block_name}</label>
              
            </div>
         
        </>
    )
}

export default EditElement14;