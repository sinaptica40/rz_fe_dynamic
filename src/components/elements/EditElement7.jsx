import React from "react";
import CreatableSelect from "react-select/creatable";

const EditElement7 =({areas,normeDellData,handleSelectMachinery,formData})=>{
  const name = areas.element_data.block_name;

  console.log(formData,"normeele")
 

    return(
        <>
            <CreatableSelect
                id="floatingSelect"
                name="machineId"
                onChange={handleSelectMachinery}
                defaultValue={formData?.normedefaultValue}
                 options={normeDellData?.data?.map((item)=>{
                  return{
                    id_machinery_type:item?.id_machinery_type,
                    value: item?.name,
                    label: item?.name,
                  }
                 })}
               // isMulti
                classNamePrefix="react-select"
                className="form-select form-control"
             />
                 
              
                <label htmlFor="floatingSelect">{name}</label>
        </>
    )
}
export default EditElement7;