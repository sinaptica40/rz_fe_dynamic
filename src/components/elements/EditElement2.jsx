import React from "react";

const EditElement2 = ({ areas, handleSubmit }) => {
  return (
    <div onClick={handleSubmit}>
      <span className="check-icon" >
        <svg
          width={14}
          height={10}
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.7074 0.293C13.8949 0.480528 14.0002 0.734836 14.0002 1C14.0002 1.26516 13.8949 1.51947 13.7074 1.707L5.70741 9.707C5.51988 9.89447 5.26557 9.99979 5.00041 9.99979C4.73524 9.99979 4.48094 9.89447 4.29341 9.707L0.293407 5.707C0.111249 5.5184 0.0104547 5.2658 0.0127331 5.0036C0.0150115 4.7414 0.12018 4.49059 0.305589 4.30518C0.490997 4.11977 0.741809 4.0146 1.00401 4.01233C1.2662 4.01005 1.5188 4.11084 1.70741 4.293L5.00041 7.586L12.2934 0.293C12.4809 0.105529 12.7352 0.000213623 13.0004 0.000213623C13.2656 0.000213623 13.5199 0.105529 13.7074 0.293Z"
            fill="#fff"
          />
        </svg>
      </span>{" "}
      {areas?.element_data.block_name}
    </div>
  )
}

export default EditElement2