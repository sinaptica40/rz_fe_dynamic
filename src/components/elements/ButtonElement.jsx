import React from "react";

const ButtonElement = ({ areas, handleDeleteNotifiche }) => {
  const areaData = areas?.element_data;
  return (
    <>
      <button
        type="button"
        onClick={() => handleDeleteNotifiche()}
        className={`btn-primary btn-default`}
      >
        {areaData?.data?.html_name}
      </button>
    </>
  );
};

export default ButtonElement;
