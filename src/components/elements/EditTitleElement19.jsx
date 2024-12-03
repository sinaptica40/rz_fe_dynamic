import React from "react";

const EditTitleElement19 =({areas,submitEditedForm})=>{
    const name = areas.element_data.block_name
    return(
        <button onClick={submitEditedForm} className="btn-primary btn-default">
            {name}
        </button>
    )
}

export default EditTitleElement19;