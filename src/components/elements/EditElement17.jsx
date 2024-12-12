import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import Select from "react-select";

const EditElement17 = ({areas,formData,handleSelectNormeListing,normeListing,normeOptions,customDropDownData})=>{
    const {element_data} = areas;
    const [opts, setOpts] = useState([])

    useEffect(() => {
     if (normeListing.length !== 0) {
      const options=normeListing?.map((item)=>{
        return{
        // normspecficationID : item?.id_standard,
        label: item?.name,
        value: item?.id_standard,
      }
      });
      
      setOpts(options)
     }
    },[normeListing])



    console.log("normeOptions",normeOptions);

     
   

    // const defaultValue = options?.find((option) => option.normspecficationID === formData?.normspecficationID?.map((id)=>id));

    return(
        <>
       
            <div
            //   className={`form-floating ${isSelectActive ? "active-floating-select" : ""
            //     }`}
             className="form-floating"
             >
              {formData?.norm?.length && !customDropDownData ? (
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
                   name="norm_specification"
                  //  value={normeOptions?.map((item) => ({
                  //   label: item?.label, 
                  //   value: item?.value, 
                  //   })) || []}
                  value={normeOptions}
                   onChange={(selectedOption) => {
                    handleSelectNormeListing(selectedOption)
                  }}
                   options={opts}
                   isMulti
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