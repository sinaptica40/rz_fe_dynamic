import React from "react";
import { useLocation } from "react-router-dom";

const TextElement = ({ areas }) => {

  const location = useLocation();
  const route = location.pathname.substring(1) || '/';
  const { element_data } = areas; 
  const addRoute = localStorage.getItem("addRoute")
  const orderData = JSON.parse(localStorage.getItem("order_Data"));
  const editRoute = localStorage.getItem("editroute");
  const viewRoute = localStorage.getItem("viewRoute");


//   console.log("orderData",element_data)

  return (
    <>
      <h3 className="ispezione-no">
        {element_data?.data?.html_name}
        {(orderData && route === addRoute || route == editRoute || route == viewRoute) && (
          <>
            <span className="order-info">
             {orderData.client} &nbsp;  &nbsp;  &nbsp;
             {orderData.order_code}
            </span>
          </>
        )}
      </h3>
    </>
  );
};

export default TextElement;
