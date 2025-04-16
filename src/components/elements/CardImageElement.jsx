import React from "react";

const CardImageElement = ({ areas, data }) => {

  return (
    <>
      <img src={areas?.element_data?.data?.html_name} />
    </>
  );
};

export default CardImageElement;
