import React, { useEffect } from "react";
import { useState } from "react";
import {
  useGetInspectionOrderDataQuery,
  useGetUserDetailsQuery,
} from "../../services/apiSlice";
import Loader from "../../lib/loader/loader";
import { useSelector, useDispatch } from "react-redux";
import { findAreaByKeyPrefix } from "../../utils/helper";
import { setPageOpen } from "../../store/pageSlice";

const MainLayout12 = ({ areas }) => {
  const order_id = localStorage.getItem("ispenzioEditID");
  const isPageOpen = useSelector((state) => state.page.isPageOpen);
  const [page, setPage] = useState(0);
  const dispatch = useDispatch();
 
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

      if (key?.includes("ReportNavBarArea-4")) {
        acc.getInspectionOrder = functionName;
        acc.getOderApiMethod = api_Method;
      }
      if (key?.includes("ReportNavBarArea2-5")) {
        acc.calenderApi = functionName;
        acc.calenderApiApiMethod = api_Method;
      }
      if (key?.includes("HeaderArea4-3")) {
        acc.userDetailsApi = functionName;
        acc.userDetailsApiMethod = api_Method;
      }
      return acc;
    }, {});

  useEffect(() => {
    const sectionIndex = sessionStorage.getItem("sezione");
    if (sectionIndex) {
      setPage(null);
      sessionStorage.removeItem("navlink");
    }
  }, []);

  // check data here in this section

  const { data: inspectionData, isFetching: isFetchingOrder } =
    useGetInspectionOrderDataQuery({
      url: getApi.getInspectionOrder,
      params: {
        id: order_id,
      },
      refetchOnMountOrArgChange: true,
    });

  // user details
  const {
    data: userDetails,
    error,
    isFetchingg,
  } = useGetUserDetailsQuery({
    url: getApi?.userDetailsApi,
    method: getApi?.userDetailsApiMethod,
    refetchOnMountOrArgChange: true,
  });

  if (isFetchingOrder) return <Loader />;

  return (
    <>
      <div className={`app ${isPageOpen ? "is-folded" : ""}`}>
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
                  {findAreaByKeyPrefix("HeaderArea4", areas, {
                    userDetails,
                  }) || <div>- -</div>}
                  <button className="navbar-toggler" type="button">
                    <span className="navbar-toggler-icon" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </header>
        {/* Side Nav Report */}
        <div className="side_nav">
          <a
            style={{ cursor: "pointer" }}
            className="dashIconClose"
            onClick={() => dispatch(setPageOpen(false))}
          >
            {/* SVG Icon */}
            <svg
              width="17"
              height="17"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.05096 1.10498C1.21899 0.936596 1.41859 0.803006 1.63831 0.711857C1.85804 0.620708 2.09358 0.573792 2.33146 0.573792C2.56934 0.573792 2.80489 0.620708 3.02462 0.711857C3.24434 0.803006 3.44393 0.936596 3.61196 1.10498L13.184 10.681L22.756 1.10498C23.0968 0.771233 23.5555 0.58543 24.0325 0.587931C24.5095 0.590431 24.9663 0.781033 25.3036 1.11834C25.6409 1.45564 25.8315 1.9124 25.834 2.38941C25.8365 2.86642 25.6507 3.32516 25.317 3.66598L15.741 13.238L25.317 22.81C25.6507 23.1508 25.8365 23.6095 25.834 24.0865C25.8315 24.5636 25.6409 25.0203 25.3036 25.3576C24.9663 25.6949 24.5095 25.8855 24.0325 25.888C23.5555 25.8905 23.0968 25.7047 22.756 25.371L13.184 15.795L3.61196 25.371C3.27114 25.7047 2.81241 25.8905 2.3354 25.888C1.85838 25.8855 1.40162 25.6949 1.06432 25.3576C0.727017 25.0203 0.536415 24.5636 0.533915 24.0865C0.531414 23.6095 0.717216 23.1508 1.05096 22.81L10.627 13.238L1.05096 3.66598C0.88258 3.49795 0.748989 3.29836 0.657841 3.07863C0.566692 2.85891 0.519775 2.62336 0.519775 2.38548C0.519775 2.1476 0.566692 1.91205 0.657841 1.69233C0.748989 1.4726 0.88258 1.27301 1.05096 1.10498Z"
                fill="#ECAD42"
              ></path>
            </svg>
          </a>
          <div className="side_nav_inner">
            {findAreaByKeyPrefix("ReportNavBarArea", areas, { page, setPage })}
            {findAreaByKeyPrefix("ReportNavBarArea2", areas, {
              inspectionData,
              getApi,
              setPage,
            })}
          </div>
        </div>

        <div className="webcontent-wrapper side_mar">
          {findAreaByKeyPrefix("ReportSectionArea", areas, { getApi })}
        </div>
      </div>
    </>
  );
};

export default MainLayout12;
