import React from "react";

const EditButtonArea0 = ({areas})=>{
    const name = areas.element_data.block_name
    return(
        <>
             <span className="plusIcon">
                    <svg
                        width={24}
                        height={25}
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M13.438 10.7791V0.327148H10.452V10.7791H0V13.7651H10.452V24.2171H13.438V13.7651H23.89V10.7791H13.438Z"
                            fill="currentcolor"
                        />
                    </svg>
                </span>{" "}
                {name}
                {/* Aggiungi elemento ispezione */}
        </>
    )
}

export default EditButtonArea0