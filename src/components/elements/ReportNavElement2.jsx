import React, { useEffect, useState, useRef } from "react";
import Loading from '../../lib/loader/loader'
import { useGetInspectionConformityMutation } from "../../services/apiSlice";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setPageOpen, setSubSectionIndex } from "../../store/pageSlice";
const ReportNavElement2 = ({ areas, inspectionData, getApi,page, setPage }) => {
  const [mainMenu, setMainMenu] = useState(null);
  const [showMenus, setShowMenus] = useState(0);
  const [subInspection, setSubInspection] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [activeSubMenuId, setActiveSubMenuId] = useState(null);
  const navigate = useNavigate();
  const route= areas?.element_data[0]?.element_type?.data[0]?.image_icon?.split('/');
  const navigate_route = route[route.length - 1];
  // api to  get inspection-conformity
  const [ getInspectionConformity ] = useGetInspectionConformityMutation();
  const mainMenuIndex = sessionStorage.getItem('sezione')
  const inspectionIndex = sessionStorage.getItem('inspectId')
  const menuindex = sessionStorage.getItem('menuindex')
  // const checkIndex = sessionStorage.getItem('submenuMain')
  // const submenu = sessionStorage.getItem('submenu')
  const subMainIndex = sessionStorage.getItem('subIndex')
  const dispatch = useDispatch()
  // const anchorRef = useRef(null);
  const check = useSelector((state) => state.isUpdateState)

  const handleRequest2 = async(inspectId, index, type=null) =>{
    setPage(null)
    setIsLoading(true)
    setShowMenus(0)
    setMainMenu(index); 
    setActiveSubMenuId(null)// Highlight the selected main menu
    sessionStorage.setItem('sezione', `4.${index+1}`)
    sessionStorage.setItem('inspectId',inspectId)
    sessionStorage.setItem('menuindex', index)
    sessionStorage.removeItem('subIndex')
    navigate(`/${navigate_route}`)
  }
  const handleRequest = async (inspectId, index, type=null) => {
    try {
      setPage(null)
      setIsLoading(true)
      setShowMenus(0)
      setMainMenu(index); 
      setActiveSubMenuId(null)// Highlight the selected main menu
      sessionStorage.setItem('sezione', `4.${index+1}`)
      // get conformity

      const response = await getInspectionConformity({
        url: getApi.calenderApi,
        method: getApi.calenderApiApiMethod,
        params: inspectId
      })
      if(response?.data?.status === "SUCCESS"){
        setSubInspection(response?.data?.data)
        setIsLoading(false)
        // sessionStorage.removeItem('subIndex')
        sessionStorage.setItem('inspectId',inspectId)
        sessionStorage.setItem('menuindex', index)
        if(type !== "navigate"){
          navigate(`/${navigate_route}`)
        }
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false)
    } finally {
      setIsLoading(false)
      // setLoadingSubMenu(false);
    }
  };

  const handleSubMenus = (idNotConformityDetected, index, mainIndex = null) => {
    setActiveSubMenuId(idNotConformityDetected); // Set active submenu ID
    // sessionStorage.removeItem('inspectId')
    //  sessionStorage.removeItem('menuindex')
     sessionStorage.setItem('subIndex',`${mainMenuIndex}.${index}`)
     dispatch(setSubSectionIndex(`${mainMenuIndex}.${index}`))
    sessionStorage.setItem('submenuMain',mainIndex)
    sessionStorage.setItem('submenu',idNotConformityDetected)
    navigate(`/edit-conformity`)
    dispatch(setPageOpen(false));
  };


  useEffect(() => {
      if(parseInt(inspectionIndex)){
        handleRequest(parseInt(inspectionIndex),parseInt(menuindex), "navigate")
      }
  }, [inspectionIndex])

  // if(isLoading) return <Loading />
  return (
    <>
      <ul className="sideNav_menu new_menu">
      {inspectionData?.data?.inspections.map((value, index) => (
            <li className="dash_nav_item" key={index}>
               <a
               style={{cursor:"pointer"}}
              //  ref={anchorRef}
                className={`subMenuLink collapsed ${mainMenu === index || `4.${index + 1}` === `${mainMenuIndex}` ? "active" : ""}`}
                data-bs-toggle="collapse"
                data-bs-target={`#submenu-${index}`}
                onClick={() => {
                  setMainMenu(index); // Update the active main menu
                  handleRequest2(value?.id_inspection, index); // Fetch submenu data
                  
                }}
              >
                <span className="icon_sideHolder">
                  {/* SVG Icon */}
                  {mainMenu === index ? <svg className="" width="12" height="3"
                    viewBox="0 0 12 3" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.5 1.5H10.738"
                      stroke="#ECAD42"
                      strokeWidth="2"
                      strokeLinecap="round" />
                  </svg> :
                  <svg width="12" className="icon_sidePlus" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.25 10.75V6M6.25 6V1.25M6.25 6H11M6.25 6H1.5" stroke="#ECAD42" strokeWidth="2" strokeLinecap="round" />
                  </svg>}
                </span>
                <span className="title_dash_nav">Sezione 4.{index + 1}</span>
                <span className="arrowIconSubmenu"></span>
              </a>

              <ul
                className={`subMenuSide collapse ${mainMenu === index ? "show" : ""}`}
                id={`submenu-${index}`}
              >
                {subInspection?.conformity_info?.length > showMenus ? (
                  subInspection?.conformity_info.map((item, subIndex) => (
                    <li
                      key={subIndex}
                      onClick={() => handleSubMenus(item?.id_not_conformity_detected, subIndex +1, index)}
                    >
                     
                      <a
                      style={{cursor: "pointer"}}
                        className={`subMenuLink ${activeSubMenuId === item?.id_not_conformity_detected || `4.${index + 1}.${subIndex+1}` === subMainIndex ? "active" : ""}`}
                      >
                         <div className="sezione_dotBox">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 16 18" fill="none">
                              <path d="M14.841 8.13965H13.441V3.52565C13.441 2.82654 13.1633 2.15606 12.6689 1.66171C12.1746 1.16737 11.5041 0.889648 10.805 0.889648H5.69598C4.99687 0.889648 4.32639 1.16737 3.83204 1.66171C3.3377 2.15606 3.05998 2.82654 3.05998 3.52565V8.13965H1.65998C1.5734 8.13952 1.48765 8.15647 1.40763 8.18954C1.32762 8.22261 1.25492 8.27115 1.1937 8.33237C1.13248 8.39359 1.08394 8.46629 1.05087 8.5463C1.0178 8.62632 1.00085 8.71207 1.00098 8.79865V16.7076C1.00085 16.7942 1.0178 16.88 1.05087 16.96C1.08394 17.04 1.13248 17.1127 1.1937 17.1739C1.25492 17.2351 1.32762 17.2837 1.40763 17.3168C1.48765 17.3498 1.5734 17.3668 1.65998 17.3666H14.841C14.9276 17.3668 15.0133 17.3498 15.0933 17.3168C15.1733 17.2837 15.246 17.2351 15.3073 17.1739C15.3685 17.1127 15.417 17.04 15.4501 16.96C15.4832 16.88 15.5001 16.7942 15.5 16.7076V8.79865C15.5001 8.71207 15.4832 8.62632 15.4501 8.5463C15.417 8.46629 15.3685 8.39359 15.3073 8.33237C15.246 8.27115 15.1733 8.22261 15.0933 8.18954C15.0133 8.15647 14.9276 8.13952 14.841 8.13965ZM4.54298 3.52565C4.54298 3.21976 4.66442 2.92639 4.88062 2.71C5.09682 2.49361 5.39009 2.37191 5.69598 2.37165H10.804C11.1097 2.37191 11.4028 2.49347 11.619 2.70965C11.8352 2.92582 11.9567 3.21894 11.957 3.52465V8.13865H4.54298V3.52565ZM14.017 15.8836H2.48298V9.62165H14.017V15.8836Z" fill="#D9D8D7" stroke="#D9D8D7" strokeWidth="0.035"/>
                              <path d="M2.48291 15.8836H14.0169V9.62256H2.48291V15.8836ZM8.24991 11.2286C8.45916 11.2286 8.66299 11.2951 8.83209 11.4183C9.0012 11.5416 9.12685 11.7153 9.19098 11.9144C9.25511 12.1136 9.25442 12.328 9.189 12.5268C9.12358 12.7255 8.99681 12.8984 8.82691 13.0206V14.1126C8.82691 14.1563 8.80953 14.1983 8.77858 14.2292C8.74764 14.2602 8.70567 14.2776 8.66191 14.2776H7.83791C7.79415 14.2776 7.75218 14.2602 7.72124 14.2292C7.69029 14.1983 7.67291 14.1563 7.67291 14.1126V13.0206C7.50301 12.8984 7.37624 12.7255 7.31082 12.5268C7.2454 12.328 7.24471 12.1136 7.30884 11.9144C7.37297 11.7153 7.49863 11.5416 7.66773 11.4183C7.83683 11.2951 8.04066 11.2286 8.24991 11.2286Z" fill="#9B9696" fill-opacity="0.15"/>
                              <path d="M7.67322 13.0206V14.1126C7.67322 14.1564 7.6906 14.1984 7.72155 14.2293C7.75249 14.2602 7.79446 14.2776 7.83822 14.2776H8.66222C8.70598 14.2776 8.74795 14.2602 8.77889 14.2293C8.80983 14.1984 8.82722 14.1564 8.82722 14.1126V13.0206C8.99733 12.8986 9.12433 12.7257 9.18993 12.5269C9.25552 12.3281 9.25633 12.1135 9.19223 11.9142C9.12813 11.7149 9.00243 11.5411 8.83324 11.4178C8.66405 11.2945 8.46008 11.228 8.25072 11.228C8.04135 11.228 7.83739 11.2945 7.6682 11.4178C7.499 11.5411 7.37331 11.7149 7.30921 11.9142C7.24511 12.1135 7.24592 12.3281 7.31151 12.5269C7.37711 12.7257 7.5031 12.8986 7.67322 13.0206Z" fill="#D9D8D7"/>
                          </svg>
                          <svg className="ms-auto" width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M2.9468 2.11378C2.9468 2.37343 2.86982 2.62724 2.72559 2.84314C2.58136 3.05904 2.37636 3.22733 2.1365 3.32674C1.89663 3.42615 1.63269 3.45221 1.37802 3.40163C1.12335 3.35104 0.88939 3.22609 0.705724 3.04257C0.522058 2.85904 0.396928 2.62518 0.346152 2.37055C0.295377 2.11592 0.321236 1.85195 0.420461 1.61201C0.519685 1.37207 0.68782 1.16694 0.90361 1.02255C1.1194 0.878154 1.37316 0.800979 1.6328 0.800782C1.80531 0.80065 1.97616 0.834515 2.13557 0.900441C2.29499 0.966366 2.43985 1.06306 2.56188 1.185C2.68391 1.30693 2.78071 1.45172 2.84676 1.61109C2.91281 1.77045 2.9468 1.94127 2.9468 2.11378Z" fill="#9B9696"/>
                              <path d="M2.9468 12.6201C2.9468 12.8798 2.86982 13.1336 2.72559 13.3495C2.58136 13.5654 2.37636 13.7337 2.1365 13.8331C1.89663 13.9325 1.63269 13.9586 1.37802 13.908C1.12335 13.8574 0.88939 13.7324 0.705724 13.5489C0.522058 13.3654 0.396928 13.1315 0.346152 12.8769C0.295377 12.6223 0.321236 12.3583 0.420461 12.1184C0.519685 11.8784 0.68782 11.6733 0.90361 11.5289C1.1194 11.3845 1.37316 11.3073 1.6328 11.3071C1.80531 11.307 1.97616 11.3409 2.13557 11.4068C2.29499 11.4727 2.43985 11.5694 2.56188 11.6913C2.68391 11.8133 2.78071 11.9581 2.84676 12.1174C2.91281 12.2768 2.9468 12.4476 2.9468 12.6201Z" fill="#9B9696"/>
                              <path d="M8.2012 2.11378C8.2012 2.37343 8.12421 2.62724 7.97998 2.84314C7.83575 3.05904 7.63075 3.22733 7.39089 3.32674C7.15103 3.42615 6.88708 3.45221 6.63241 3.40163C6.37774 3.35104 6.14378 3.22609 5.96012 3.04257C5.77645 2.85904 5.65132 2.62518 5.60055 2.37055C5.54977 2.11592 5.57563 1.85195 5.67486 1.61201C5.77408 1.37207 5.94221 1.16694 6.158 1.02255C6.37379 0.878154 6.62755 0.800979 6.88719 0.800782C7.0597 0.80065 7.23055 0.834515 7.38997 0.900441C7.54938 0.966366 7.69424 1.06306 7.81627 1.185C7.9383 1.30693 8.03511 1.45172 8.10115 1.61109C8.1672 1.77045 8.2012 1.94127 8.2012 2.11378Z" fill="#9B9696"/>
                              <path d="M8.2012 12.6201C8.2012 12.8798 8.12421 13.1336 7.97998 13.3495C7.83575 13.5654 7.63075 13.7337 7.39089 13.8331C7.15103 13.9325 6.88708 13.9586 6.63241 13.908C6.37774 13.8574 6.14378 13.7324 5.96012 13.5489C5.77645 13.3654 5.65132 13.1315 5.60055 12.8769C5.54977 12.6223 5.57563 12.3583 5.67486 12.1184C5.77408 11.8784 5.94221 11.6733 6.158 11.5289C6.37379 11.3845 6.62755 11.3073 6.88719 11.3071C7.0597 11.307 7.23055 11.3409 7.38997 11.4068C7.54938 11.4727 7.69424 11.5694 7.81627 11.6913C7.9383 11.8133 8.03511 11.9581 8.10115 12.1174C8.1672 12.2768 8.2012 12.4476 8.2012 12.6201Z" fill="#9B9696"/>
                              <path d="M8.2012 7.36671C8.2012 7.62636 8.12421 7.88017 7.97998 8.09607C7.83575 8.31197 7.63075 8.48026 7.39089 8.57967C7.15103 8.67908 6.88708 8.70514 6.63241 8.65455C6.37774 8.60397 6.14378 8.47902 5.96012 8.2955C5.77645 8.11197 5.65132 7.87811 5.60055 7.62348C5.54977 7.36885 5.57563 7.10488 5.67486 6.86494C5.77408 6.625 5.94221 6.41987 6.158 6.27548C6.37379 6.13108 6.62755 6.05391 6.88719 6.05371C7.0597 6.05358 7.23055 6.08744 7.38997 6.15337C7.54938 6.2193 7.69424 6.31599 7.81627 6.43793C7.9383 6.55986 8.03511 6.70465 8.10115 6.86402C8.1672 7.02338 8.2012 7.1942 8.2012 7.36671Z" fill="#9B9696"/>
                              <path d="M2.9468 7.36671C2.9468 7.62636 2.86982 7.88017 2.72559 8.09607C2.58136 8.31197 2.37636 8.48026 2.1365 8.57967C1.89663 8.67908 1.63269 8.70514 1.37802 8.65455C1.12335 8.60397 0.88939 8.47902 0.705724 8.2955C0.522058 8.11197 0.396928 7.87811 0.346152 7.62348C0.295377 7.36885 0.321236 7.10488 0.420461 6.86494C0.519685 6.625 0.68782 6.41987 0.90361 6.27548C1.1194 6.13108 1.37316 6.05391 1.6328 6.05371C1.80531 6.05358 1.97616 6.08744 2.13557 6.15337C2.29499 6.2193 2.43985 6.31599 2.56188 6.43793C2.68391 6.55986 2.78071 6.70465 2.84676 6.86402C2.91281 7.02338 2.9468 7.1942 2.9468 7.36671Z" fill="#9B9696"/>
                          </svg>
                         </div>
                         <div className="sideSub_name">
                            4.{index + 1}.{subIndex+1} {item?.cluster_info?.nc_name}{" "}
                            {item?.cluster_info?.name}
                         </div>
                      </a>
                    </li>
                  ))
                ) : (
                  <></>
                )}
              </ul>
            </li>
          ))}
      </ul>
    </>
  );
};

export default ReportNavElement2;
