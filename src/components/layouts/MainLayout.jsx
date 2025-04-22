import React from "react";
import { useState } from "react";
import {
  useGetReportDashboardQuery,
  useGetUserDetailsQuery,
} from "../../services/apiSlice";
import { findAreaByKeyPrefix } from "../../utils/helper";
const MainLayout = ({ areas }) => {
  const [showModal, setShowModal] = useState(false);
  const handleModal = (clickedDateData) => {
    setShowModal(true);
  };

  // function for get All apis
  let getApi = areas
    .filter(
      (item) => item?.props?.children?.props?.children?.props?.api != null
    )
    .reduce((acc, user) => {
      const key = user?.key;
      const functionName =
        user.props.children.props.children.props.api.function_name;
      const api_Method =
        user?.props?.children?.props?.children?.props?.api?.method_type;

      if (key?.includes("MainBodyArea2-5")) {
        acc.reportApi = functionName;
        acc.reportApiMethod = api_Method;
      }

      if (key?.includes("HeaderArea4-3")) {
        acc.userDetailsApi = functionName;
        acc.userDetailsApiMethod = api_Method;
      }

      return acc;
    }, {});

  // report list
  const { data, isFetching } = useGetReportDashboardQuery({
    url: getApi.reportApi,
    method: getApi.reportApiMethod,
  });

  //    // user details
  const { data: userDetails, refetch } = useGetUserDetailsQuery({
    url: getApi?.userDetailsApi,
    method: getApi?.userDetailsApiMethod,
    refetchOnMountOrArgChange: true,
  });

  return (
    <>
      <div className="loader-wrapper" style={{ display: "none" }}>
        <div className="loader">
          <img src="img/logo.png" alt="" />
        </div>
      </div>
      <div className="progress-wrap cursor-pointer">
        <svg
          className="arrowTop"
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.99996 15.9999H6.99996V3.99991L1.49996 9.49991L0.0799561 8.07991L7.99996 0.159912L15.92 8.07991L14.5 9.49991L8.99996 3.99991V15.9999Z"
            fill="black"
          />
        </svg>
        <svg
          className="progress-circle svg-content"
          width="100%"
          height="100%"
          viewBox="-1 -1 102 102"
        >
          <path
            d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
            style={{
              transition: "stroke-dashoffset 10ms linear 0s",
              strokeDasharray: "307.919, 307.919",
              strokeDashoffset: "307.919",
            }}
          ></path>
        </svg>
      </div>
      <header id="header">
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-12">
              <nav className="navbar navbar-expand-lg">
                {findAreaByKeyPrefix("HeaderArea1", areas) || <div>- -</div>}
                <div className="overlay" style={{ display: "none" }} />
                {findAreaByKeyPrefix("HeaderArea2", areas) || <div>- -</div>}
                {findAreaByKeyPrefix("HeaderArea4", areas, { userDetails }) || (
                  <div>- -</div>
                )}
                <button className="navbar-toggler" type="button">
                  <span className="navbar-toggler-icon" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>
      <div className="webcontent-wrapper">
        <div className="row g-xxl-5">
          {findAreaByKeyPrefix("MainBodyArea1", areas)}
          {findAreaByKeyPrefix("MainBodyArea2", areas, {
            reports: data?.data?.reportList,
          })}
          {findAreaByKeyPrefix("MainBodyArea3", areas, {
            notifiches: data?.data?.notificationsList,
          })}
        </div>
        <div className="row g-xxl-5">
          {findAreaByKeyPrefix("MainBodyArea4", areas, {
            inspectionData: data?.data?.orderList,
          })}
          {findAreaByKeyPrefix("MainBodyArea5", areas, {
            calenderData: data?.data?.calendarList,
            showModal,
            setShowModal,
            handleModal,
          })}
        </div>
      </div>
    </>
  );
};

export default MainLayout;
