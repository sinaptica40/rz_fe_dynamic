import React from "react";

const NewMachineryElement7 =({areas})=>{
    
    return(
        <>
         <button
         type="submit"
         className="btn-primary"
        // onclick="document.location='macchinari.html'"
                >  
               {/* Salva Nome Macchinario */}
               {areas?.element_data?.block_name}
                </button>
        </>
    )
}

export default NewMachineryElement7