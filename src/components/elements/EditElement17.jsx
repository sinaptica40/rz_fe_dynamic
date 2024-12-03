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
             <input
               className="form-control"
               id="floatingInput"
               autoComplete="off"
              value={formData?.normeId?.length ? formData?.normeId?.map((item)=>item?.name) : ""}
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

export default EditElement17;