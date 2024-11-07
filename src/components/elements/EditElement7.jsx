import React from "react";

const EditElement7 =({areas})=>{
  const name = areas.element_data.block_name
    return(
        <>
            <select
                  className="form-select form-control"
                  id="floatingSelect"
                  aria-label="Floating label select example"
                >
                  <option selected="">Seleziona {name}</option>
                  <option value={1}>One</option>
                  <option value={2}>Two</option>
                  <option value={3}>Three</option>
                </select>
                <label htmlFor="floatingSelect">{name}</label>
        </>
    )
}
export default EditElement7