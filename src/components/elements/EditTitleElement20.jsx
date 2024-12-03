import React from "react";

const EditTitleElement20 =({areas,handleSubmit})=>{
    const name = areas.element_data.block_name
    return(
        <>
        <button onClick={handleSubmit} className="btn-primary btn-default">
            {name}
        </button>
        </>
    )
}

export default EditTitleElement20;