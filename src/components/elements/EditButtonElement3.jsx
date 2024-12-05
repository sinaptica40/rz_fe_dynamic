import React from "react";

const EditButtonElement3 = ({areas})=>{
    const name = areas.element_data.block_name
    return(
        <>
            <span className="downloadIcon">
                  <svg
                    width={28}
                    height={26}
                    viewBox="0 0 28 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.778 16.5901V1.25708M13.778 16.5901L8.667 11.4791M13.778 16.5901L18.889 11.4791M1 19.1461L1.793 22.3211C1.93124 22.874 2.25028 23.3648 2.69944 23.7156C3.1486 24.0663 3.7021 24.2569 4.272 24.2571H23.283C23.8528 24.2572 24.4063 24.0668 24.8555 23.7162C25.3046 23.3656 25.6237 22.8749 25.762 22.3221L26.556 19.1461"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>{" "}
                {name}
        </>
    )
}

export default EditButtonElement3