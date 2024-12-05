import React from 'react'
import Select from "react-select";

const EditElement17 = ({areas,formData})=>{
    const {element_data} = areas;
    return(
        <>
       
            <div
            //   className={`form-floating ${isSelectActive ? "active-floating-select" : ""
            //     }`}
             className="form-floating"
             >
              {formData?.norm?.length ? (
                <>
                <input
                 className="form-control"
                 id="floatingInput"
                 autoComplete="off"
                 value={formData?.norm?.length ? formData?.norm?.map((item)=>item?.name) : ""}
                />

                <label htmlFor="floating-select">{element_data.block_name}</label>
                {/* // {errors.norm_specification && (
                //   <div className="error-message text-danger">
                //     {errors.norm_specification}
                //   </div>
                //  )} */}
                </>
                 ):(
                  <>
                  <Select
                   id="floatingSelect"
                   name="norm"
                  //  defaultValue={formData?.defaultValue}
                  //  value={{label:MachineryID}}
                  //   onChange={handleSelectChange}
                  //  options={MachineryData?.data?.map((item)=>{
                  //   return{
                  //   value: item?.brand_name,
                  //   label: item?.brand_name,
                  //     }
                  //    })}
               
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
              
                  </>
                 )}
            
              
            </div>
          
        </>
    )
}

export default EditElement17;