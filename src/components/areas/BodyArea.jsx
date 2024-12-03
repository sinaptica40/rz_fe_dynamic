import React from "react";

const BodyArea =({children})=>{
    return(
        <div>
            <a className="close-iconBtn">
                {children}
            </a>
        </div>
    )
}
export default BodyArea;