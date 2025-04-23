import React, { useState, useEffect } from "react";
import {
  useGetRzOrderQuery,
  useGetUserDetailsQuery,
} from "../../services/apiSlice";
import { useSelector } from "react-redux";
import { findAreaByKeyPrefix } from "../../utils/helper";
const MainLayout6 = ({ areas }) => {
  const ispenzioViewID = localStorage.getItem("ispenzioViewID");
  const [clientformData, setClientformData] = useState({
    description: "",
    created_by: "",
    client: "",
    orderId: "",
    date: null,
  });

  const [totalDataLength, setTotalDataLength] = useState([]);

  const filterApi = areas
    .filter(
      (item) => item?.props?.children?.props?.children?.props?.api != null
    )
    .reduce((acc, user) => {
      const key = user?.key;
      const function_name =
        user?.props?.children?.props?.children?.props?.api?.function_name;
      const apiMethod =
        user?.props?.children?.props?.children?.props?.api?.method_type;
      if (key?.includes("FormArea7")) {
        acc.getRzOrderUrl = function_name;
        acc.getRzOrderMethod = apiMethod;
      }

      if (key?.includes("HeaderArea4-3")) {
        acc.userDetailsApi = function_name;
        acc.userDetailsApiMethod = apiMethod;
      }

      return acc;
    }, {});

  const { data: rzOrderdetails, refetch } = useGetRzOrderQuery({
    url: filterApi.getRzOrderUrl,
    params: ispenzioViewID,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (rzOrderdetails) {
      let datas = rzOrderdetails?.data;
      setTotalDataLength(datas?.inspections?.length);
      const clientData = {
        client: datas?.client,
        description: datas?.description,
        date: datas?.inspections?.[0]?.calendar_info?.date,
        created_by: datas?.created_by_name,
        machinery_info: datas?.inspections,
      };

      setClientformData(clientData);
    }
  }, [rzOrderdetails?.data]);

  // user details
  const {
    data: userDetails,
    error,
    isFetchingg,
  } = useGetUserDetailsQuery({
    url: filterApi?.userDetailsApi,
    method: filterApi?.userDetailsApiMethod,
    refetchOnMountOrArgChange: true,
  });

  return (
    <>
      {/* loader  */}
      <div className="loader-wrapper" style={{ display: "none" }}>
        <div className="loader">
          <img src="img/logo.png" alt="" />
        </div>
      </div>
      {/* Back to Top */}
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
      {/* Header */}
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
        <div className="container-fluid p-0">
          <div className="cards-block">
            <div className="card-header add-form-header">
              <div className="card-title">
                {findAreaByKeyPrefix("FormArea7", areas) || <div>- -</div>}
                {findAreaByKeyPrefix("FormArea8", areas) || <div>- -</div>}
              </div>
              {findAreaByKeyPrefix("ViewIdArea", areas) || <div>- -</div>}
              <div className="action_dropdownBox"></div>
            </div>
            {findAreaByKeyPrefix("EditArea4", areas) || <div>- -</div>}
            <div className="form-input-block">
              <form action="#!">
                <div className="row row-gap">
                  {findAreaByKeyPrefix("EditArea5", areas, {
                    value: clientformData?.description,
                    label: "description",
                  }) || <div>- -</div>}
                  {findAreaByKeyPrefix("EditArea6", areas, {
                    clientformData,
                  }) || <div>- -</div>}
                  {findAreaByKeyPrefix("EditArea8", areas, {
                    value: clientformData?.created_by,
                    label: "created_by",
                  }) || <div>- -</div>}
                  {findAreaByKeyPrefix("ViewArea1", areas, {
                    value: clientformData?.date,
                    label: "date",
                  }) || <div>- -</div>}
                </div>
              </form>
              {/* Add Element */}
              <div className="new-added">
                <>
                  {Array.from({ length: totalDataLength }).map((_, index) => (
                    <div key={index}>
                      <div className="heading-bg-element mb-4">
                        <div className="heading-elm-itle">
                          {findAreaByKeyPrefix("ViewPageHeadingArea",areas, {
                            index,
                          })}
                        </div>
                      </div>
                      <div className="row row-gap">
                        {findAreaByKeyPrefix("ViewArea2", areas, {
                          value:
                            clientformData?.machinery_info?.[index]
                              ?.machinery_info?.typology,
                          label: "machinery_info",
                        }) || <div>- -</div>}
                        {findAreaByKeyPrefix("ViewArea3", areas, {
                          value:
                            clientformData?.machinery_info?.[index]
                              ?.machinery_info?.name,
                          label: "name",
                        }) || <div>- -</div>}
                        {findAreaByKeyPrefix("ViewArea4", areas, {
                          value:
                            clientformData?.machinery_info?.[index]
                              ?.machinery_info?.brand_name,
                          label: "brand_name",
                        }) || <div>- -</div>}
                        {findAreaByKeyPrefix("ViewArea5", areas, {
                          value:
                            clientformData?.machinery_info?.[index]
                              ?.machinery_info?.year,
                          label: "machinery_info",
                        }) || <div>- -</div>}
                        {findAreaByKeyPrefix("ViewArea6", areas, {
                          value: clientformData?.machinery_info?.[
                            index
                          ]?.machinery_info?.norm_specification?.map(
                            (item) => item?.name
                          ),
                          label: "machinery_info",
                        }) || <div>- -</div>}
                        <div className="col-md-4">
                          <div className="form-custom-check inline-check ccmt-50">
                            {findAreaByKeyPrefix("EditCheckArea1", areas, {
                              formValues: {
                                ce: clientformData?.machinery_info?.[index]
                                  ?.machinery_info?.ce,
                              },
                            }) || <div>- -</div>}
                            {findAreaByKeyPrefix("EditCheckArea2", areas, {
                              formValues: {
                                atex: clientformData?.machinery_info?.[index]
                                  ?.machinery_info?.atex,
                              },
                            }) || <div>- -</div>}
                          </div>
                        </div>
                        {findAreaByKeyPrefix("ViewArea7", areas, {
                          value:
                            clientformData?.machinery_info?.[index]
                              ?.ispector_info?.name,
                          label: "ispector_info",
                        }) || <div>- -</div>}
                        {findAreaByKeyPrefix("ViewArea8", areas, {
                          value:
                            clientformData?.machinery_info?.[index]
                              ?.working_area_info?.wa_name,
                          label: "wa_name",
                        }) || <div>- -</div>}
                        {findAreaByKeyPrefix("ViewArea9", areas, {
                          value: clientformData?.machinery_info?.[index]?.notes,
                          label: "notes",
                        }) || <div>- -</div>}
                      </div>
                    </div>
                  ))}
                </>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout6;
