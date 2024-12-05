import React from "react";
import { useNavigate } from "react-router-dom";

const EditElement16 = ({ areas,handleClose }) => {
    console.log("EditElement16", areas);


    return (
        <a className="close-iconBtn" onClick={handleClose}>
          <img width={"18px"} height={"18px"} src={areas?.element_data?.interaction_name}/>
        </a>
    )
}

export default EditElement16;