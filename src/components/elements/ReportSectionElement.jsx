import React, { useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useGetInspectionConformityMutation, useGetInspectionPointsQuery, useCreateInspectionMutation, useAddConformityMutation, useGetConformityTypesQuery, useCreateClusterMutation, useGetInspectionPointsMutation, useDeleteConformityDataMutation, useOpenAitextMutation, useGetDropdownListQuery, useUpdateAreaMutation } from '../../services/apiSlice'
import Swal from 'sweetalert2'
import {toast} from 'react-toastify'
import moment from 'moment'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch } from 'react-redux'
import { setIsUpdate } from '../../store/pageSlice'
import Loader from '../../lib/loader/loader'
import { getStatusColorCode } from '../../utils/helper'
import SignPad from '../SignPad'
import MyDatePicker from '../DatePicker'
const ReportSectionElement = ({ areas, getApi }) => {
  const inspectId = sessionStorage.getItem('inspectId')
  const [isLoading, setIsLoading] = useState(false)
  const mainIndex = localStorage.getItem('mainMenuIndex')
 const dispatch = useDispatch()
  const navigate = useNavigate()
  const [inspect, setInspectData] = useState()
  const sectionIndex = localStorage.getItem('section')
  const sezioneIndex = sessionStorage.getItem('sezione')
 const [getInspectionConformity] = useGetInspectionConformityMutation();

  if(mainIndex !== null){
      
  }
  const getInspectConformity = async() => {
      try {
          setIsLoading(true)
          const response = await getInspectionConformity({
            url: getApi.calenderApi,
            method: getApi.calenderApiApiMethod,
            params: inspectId
          }).unwrap()
          if (response.status === "SUCCESS") {
              setIsLoading(false)
              setInspectData(response.data);
          } else {
              setIsLoading(false)
              throw new Error("Failed to fetch conformity data");
          }
      } catch (err) {
          setIsLoading(false)
          console.error(err);
      }
  };

  useEffect(() => {
     if(inspectId) getInspectConformity()
  }, [inspectId])
  
  const [flag, setFlag] = useState(true)
  const [loader, setLoader] = useState(false)
  const handleConformity = async (id_not_conformity_detected, index) => {
      sessionStorage.setItem('subIndex',`${sezioneIndex}.${index}`)
      sessionStorage.setItem('submenu', id_not_conformity_detected)
      navigate(`/edit-conformity`)
  }

  const [deleteConformityData] = useDeleteConformityDataMutation()
  
  const handleDelete = async (id) => {
      try {
          const result = await Swal.fire({
            title: "Sei sicuro?",
            text: "Non potrai più tornare indietro!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sì, cancellalo!",
            cancelButtonText: "Cancellare",
          });

          if (result.isConfirmed) {
              setLoader(true)
              const response = await deleteConformityData({
                  params: id,
                  method: 'DELETE',
              }).unwrap();
              if (response?.status == 'success' || response?.status == 'SUCCESS') {
                  setLoader(false)
                  toast.success(response?.message);
                  setInspectData(response.data)
                  dispatch(setIsUpdate(1))
                  getInspectConformity()
                  window.location.href = `/${response?.navigate}`;
                 
              } else {
                  setLoader(false)
                  toast.error(response?.message);
              }
          }
      } catch (error) {
          setLoader(false)
      }
  };
  if (isLoading || loader) return <Loader />
  const handleNavigate = () =>{
      localStorage.setItem('mainMenuIndex', null)
      navigate("/dashboard")
  }
 
  return (
    <div>
       <>
            {flag ? <div className="">
                <div className="container-fluid p-0">
                    <a href="javascript:void(0);" className="dashIconFold" id="foldBtn" >
                        <div className="folded">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="17" viewBox="0 0 6 10"
                                fill="none">
                                <path fillRule="evenodd" clipRule="evenodd"
                                    d="M0.603669 0.690378C0.802481 0.497088 1.12482 0.497088 1.32363 0.690377L5.39636 4.64997C5.49183 4.74279 5.54547 4.86869 5.54547 4.99996C5.54547 5.13122 5.49183 5.25712 5.39636 5.34994L1.32363 9.30953C1.12482 9.50282 0.802481 9.50282 0.603669 9.30953C0.404856 9.11624 0.404856 8.80286 0.603669 8.60957L4.31641 4.99996L0.603669 1.39034C0.404856 1.19705 0.404856 0.883667 0.603669 0.690378Z"
                                    fill="#ECAD42" />
                            </svg>
                        </div>
                    </a>
                    <div className="contentBox">
                        <a className="close-iconBtn" style={{cursor: "Pointer"}} onClick={handleNavigate}>
                            <svg width="26" height="26" viewBox="0 0 26 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M1.05096 1.10498C1.21899 0.936596 1.41859 0.803006 1.63831 0.711857C1.85804 0.620708 2.09358 0.573792 2.33146 0.573792C2.56934 0.573792 2.80489 0.620708 3.02462 0.711857C3.24434 0.803006 3.44393 0.936596 3.61196 1.10498L13.184 10.681L22.756 1.10498C23.0968 0.771233 23.5555 0.58543 24.0325 0.587931C24.5095 0.590431 24.9663 0.781033 25.3036 1.11834C25.6409 1.45564 25.8315 1.9124 25.834 2.38941C25.8365 2.86642 25.6507 3.32516 25.317 3.66598L15.741 13.238L25.317 22.81C25.6507 23.1508 25.8365 23.6095 25.834 24.0865C25.8315 24.5636 25.6409 25.0203 25.3036 25.3576C24.9663 25.6949 24.5095 25.8855 24.0325 25.888C23.5555 25.8905 23.0968 25.7047 22.756 25.371L13.184 15.795L3.61196 25.371C3.27114 25.7047 2.81241 25.8905 2.3354 25.888C1.85838 25.8855 1.40162 25.6949 1.06432 25.3576C0.727017 25.0203 0.536415 24.5636 0.533915 24.0865C0.531414 23.6095 0.717216 23.1508 1.05096 22.81L10.627 13.238L1.05096 3.66598C0.88258 3.49795 0.748989 3.29836 0.657841 3.07863C0.566692 2.85891 0.519775 2.62336 0.519775 2.38548C0.519775 2.1476 0.566692 1.91205 0.657841 1.69233C0.748989 1.4726 0.88258 1.27301 1.05096 1.10498Z"
                                    fill="currentcolor" />
                            </svg>
                        </a>
                            <div className="reportHeader">
                          <div>Ispezione | {inspect?.order_info?.client}</div>
                          <div>{inspect?.order_info?.order_code}</div>
                          <div>Data Inizio Ispezione <span>{moment(inspect?.order_info?.create_at).format('DD-MM-YYYY')}</span></div>
                        </div>
                        <div className="report_innerBox">
                            <div className="tab_previewBox">

                            <button type="button" className="btn-primary btn-default" onClick={() =>setFlag(false)}> 
                            <span className="plusIcon me-2"><svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M13.438 10.7791V0.327148H10.452V10.7791H0V13.7651H10.452V24.2171H13.438V13.7651H23.89V10.7791H13.438Z" fill="currentcolor"></path>
                                            </svg></span>
                                             Aggiungi elemento Non-Conformita</button>
                                <div className="sezione_titleBox">
                                    <h3 className="sezione_tableTitle">Sezione {sezioneIndex}</h3>
                                    <ul className="nav nav-pills" id="pills-tab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                                <img src="img/icon-view-list.png" alt="" />
                                                Lista</button>
                                        </li>
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false"><img src="img/icon-grid-view.png" alt="" />
                                                Preview</button>
                                        </li>
                                    </ul>
                                </div>
                                <div className="tab-content" id="pills-tabContent">
                                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                        <div className="table-responsive tableFont24">
                                            <table className="table mb-0">
                                                <thead className="thbold">
                                                    <tr>
                                                        <th scope="col">Non conformità</th>
                                                        <th scope="col">Area di Lavoro</th>
                                                        <th scope="col">ID NC</th>
                                                        <th scope="col">Ispettore</th>
                                                        <th scope="col">Status Conformita</th>
                                                        <th>&nbsp;</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {inspect?.conformity_info?.map((value, index) => (
                                                        <tr>
                                                            <td>
                                                                <div className="sezione_tableFlex">
                                                                    <button className="switchEquipment pe-0 sezione_dotBox">
                                                                        <svg width="20" height="23" viewBox="0 0 20 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M18.899 10.3511H17.087V4.38508C17.087 3.93715 16.9987 3.49361 16.8272 3.07981C16.6557 2.66602 16.4043 2.29008 16.0875 1.97349C15.7706 1.65689 15.3944 1.40585 14.9805 1.23471C14.5665 1.06357 14.1229 0.975681 13.675 0.976076H7.075C6.62707 0.975681 6.18346 1.06357 5.76951 1.23471C5.35557 1.40585 4.97941 1.65689 4.66253 1.97349C4.34566 2.29008 4.09429 2.66602 3.92278 3.07981C3.75128 3.49361 3.663 3.93715 3.663 4.38508V10.3511H1.852C1.74008 10.3509 1.62923 10.3729 1.5258 10.4157C1.42237 10.4584 1.32839 10.5212 1.24925 10.6003C1.17011 10.6795 1.10736 10.7734 1.06459 10.8769C1.02182 10.9803 0.999869 11.0912 1 11.2031V21.4311C0.999869 21.543 1.02182 21.6539 1.06459 21.7573C1.10736 21.8607 1.17011 21.9547 1.24925 22.0338C1.32839 22.113 1.42237 22.1757 1.5258 22.2185C1.62923 22.2613 1.74008 22.2832 1.852 22.2831H18.899C19.0109 22.2832 19.1218 22.2613 19.2252 22.2185C19.3286 22.1757 19.4226 22.113 19.5017 22.0338C19.5809 21.9547 19.6436 21.8607 19.6864 21.7573C19.7292 21.6539 19.7511 21.543 19.751 21.4311V11.2031C19.7511 11.0912 19.7292 10.9803 19.6864 10.8769C19.6436 10.7734 19.5809 10.6795 19.5017 10.6003C19.4226 10.5212 19.3286 10.4584 19.2252 10.4157C19.1218 10.3729 19.0109 10.3509 18.899 10.3511ZM5.581 4.38508C5.581 4.18898 5.61966 3.9948 5.69476 3.81365C5.76987 3.6325 5.87995 3.46794 6.0187 3.32936C6.15746 3.19079 6.32217 3.08094 6.50342 3.00607C6.68467 2.93121 6.8789 2.89281 7.075 2.89308H13.675C14.0707 2.89308 14.4502 3.05027 14.73 3.33007C15.0098 3.60988 15.167 3.98937 15.167 4.38508V10.3511H5.581V4.38508ZM17.833 20.3661H2.918V12.2661H17.833V20.3661Z" fill="#D9D8D7" stroke="#D9D8D7" strokeWidth="0.035" />
                                                                            <path d="M2.91699 20.3661H17.833V12.2661H2.91699V20.3661ZM10.375 14.3471C10.6455 14.3474 10.9089 14.4334 11.1274 14.5928C11.3459 14.7521 11.5083 14.9767 11.5912 15.2341C11.6741 15.4916 11.6732 15.7687 11.5887 16.0256C11.5043 16.2826 11.3405 16.5061 11.121 16.6641V18.0751C11.1207 18.1315 11.0982 18.1855 11.0583 18.2254C11.0184 18.2653 10.9644 18.2879 10.908 18.2881H9.84199C9.78558 18.2879 9.73156 18.2653 9.69167 18.2254C9.65178 18.1855 9.62926 18.1315 9.62899 18.0751V16.6631C9.40949 16.5051 9.24573 16.2816 9.16125 16.0246C9.07676 15.7677 9.07591 15.4906 9.1588 15.2331C9.24169 14.9757 9.40406 14.7511 9.62258 14.5918C9.8411 14.4324 10.1045 14.3464 10.375 14.3461V14.3471Z" fill="#9B9696" fill-opacity="0.15" />
                                                                            <path d="M9.63019 16.6612V18.0732C9.63045 18.1296 9.65298 18.1836 9.69287 18.2235C9.73276 18.2634 9.78678 18.2859 9.84319 18.2862H10.9082C10.9646 18.2859 11.0186 18.2634 11.0585 18.2235C11.0984 18.1836 11.1209 18.1296 11.1212 18.0732V16.6612C11.3411 16.5033 11.5052 16.2797 11.5899 16.0226C11.6747 15.7655 11.6756 15.4881 11.5927 15.2304C11.5098 14.9727 11.3472 14.748 11.1284 14.5886C10.9096 14.4292 10.6459 14.3433 10.3752 14.3433C10.1045 14.3433 9.84076 14.4292 9.62197 14.5886C9.40319 14.748 9.24063 14.9727 9.15769 15.2304C9.07476 15.4881 9.07572 15.7655 9.16045 16.0226C9.24518 16.2797 9.4103 16.5033 9.63019 16.6612Z" fill="#D9D8D7" />
                                                                        </svg>
                                                                        <svg className="ms-auto" width="9" height="14" viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M2.9468 2.11378C2.9468 2.37343 2.86982 2.62724 2.72559 2.84314C2.58136 3.05904 2.37636 3.22733 2.1365 3.32674C1.89663 3.42615 1.63269 3.45221 1.37802 3.40163C1.12335 3.35104 0.88939 3.22609 0.705724 3.04257C0.522058 2.85904 0.396928 2.62518 0.346152 2.37055C0.295377 2.11592 0.321236 1.85195 0.420461 1.61201C0.519685 1.37207 0.68782 1.16694 0.90361 1.02255C1.1194 0.878154 1.37316 0.800979 1.6328 0.800782C1.80531 0.80065 1.97616 0.834515 2.13557 0.900441C2.29499 0.966366 2.43985 1.06306 2.56188 1.185C2.68391 1.30693 2.78071 1.45172 2.84676 1.61109C2.91281 1.77045 2.9468 1.94127 2.9468 2.11378Z" fill="#9B9696" />
                                                                            <path d="M2.9468 12.6201C2.9468 12.8798 2.86982 13.1336 2.72559 13.3495C2.58136 13.5654 2.37636 13.7337 2.1365 13.8331C1.89663 13.9325 1.63269 13.9586 1.37802 13.908C1.12335 13.8574 0.88939 13.7324 0.705724 13.5489C0.522058 13.3654 0.396928 13.1315 0.346152 12.8769C0.295377 12.6223 0.321236 12.3583 0.420461 12.1184C0.519685 11.8784 0.68782 11.6733 0.90361 11.5289C1.1194 11.3845 1.37316 11.3073 1.6328 11.3071C1.80531 11.307 1.97616 11.3409 2.13557 11.4068C2.29499 11.4727 2.43985 11.5694 2.56188 11.6913C2.68391 11.8133 2.78071 11.9581 2.84676 12.1174C2.91281 12.2768 2.9468 12.4476 2.9468 12.6201Z" fill="#9B9696" />
                                                                            <path d="M8.2012 2.11378C8.2012 2.37343 8.12421 2.62724 7.97998 2.84314C7.83575 3.05904 7.63075 3.22733 7.39089 3.32674C7.15103 3.42615 6.88708 3.45221 6.63241 3.40163C6.37774 3.35104 6.14378 3.22609 5.96012 3.04257C5.77645 2.85904 5.65132 2.62518 5.60055 2.37055C5.54977 2.11592 5.57563 1.85195 5.67486 1.61201C5.77408 1.37207 5.94221 1.16694 6.158 1.02255C6.37379 0.878154 6.62755 0.800979 6.88719 0.800782C7.0597 0.80065 7.23055 0.834515 7.38997 0.900441C7.54938 0.966366 7.69424 1.06306 7.81627 1.185C7.9383 1.30693 8.03511 1.45172 8.10115 1.61109C8.1672 1.77045 8.2012 1.94127 8.2012 2.11378Z" fill="#9B9696" />
                                                                            <path d="M8.2012 12.6201C8.2012 12.8798 8.12421 13.1336 7.97998 13.3495C7.83575 13.5654 7.63075 13.7337 7.39089 13.8331C7.15103 13.9325 6.88708 13.9586 6.63241 13.908C6.37774 13.8574 6.14378 13.7324 5.96012 13.5489C5.77645 13.3654 5.65132 13.1315 5.60055 12.8769C5.54977 12.6223 5.57563 12.3583 5.67486 12.1184C5.77408 11.8784 5.94221 11.6733 6.158 11.5289C6.37379 11.3845 6.62755 11.3073 6.88719 11.3071C7.0597 11.307 7.23055 11.3409 7.38997 11.4068C7.54938 11.4727 7.69424 11.5694 7.81627 11.6913C7.9383 11.8133 8.03511 11.9581 8.10115 12.1174C8.1672 12.2768 8.2012 12.4476 8.2012 12.6201Z" fill="#9B9696" />
                                                                            <path d="M8.2012 7.36671C8.2012 7.62636 8.12421 7.88017 7.97998 8.09607C7.83575 8.31197 7.63075 8.48026 7.39089 8.57967C7.15103 8.67908 6.88708 8.70514 6.63241 8.65455C6.37774 8.60397 6.14378 8.47902 5.96012 8.2955C5.77645 8.11197 5.65132 7.87811 5.60055 7.62348C5.54977 7.36885 5.57563 7.10488 5.67486 6.86494C5.77408 6.625 5.94221 6.41987 6.158 6.27548C6.37379 6.13108 6.62755 6.05391 6.88719 6.05371C7.0597 6.05358 7.23055 6.08744 7.38997 6.15337C7.54938 6.2193 7.69424 6.31599 7.81627 6.43793C7.9383 6.55986 8.03511 6.70465 8.10115 6.86402C8.1672 7.02338 8.2012 7.1942 8.2012 7.36671Z" fill="#9B9696" />
                                                                            <path d="M2.9468 7.36671C2.9468 7.62636 2.86982 7.88017 2.72559 8.09607C2.58136 8.31197 2.37636 8.48026 2.1365 8.57967C1.89663 8.67908 1.63269 8.70514 1.37802 8.65455C1.12335 8.60397 0.88939 8.47902 0.705724 8.2955C0.522058 8.11197 0.396928 7.87811 0.346152 7.62348C0.295377 7.36885 0.321236 7.10488 0.420461 6.86494C0.519685 6.625 0.68782 6.41987 0.90361 6.27548C1.1194 6.13108 1.37316 6.05391 1.6328 6.05371C1.80531 6.05358 1.97616 6.08744 2.13557 6.15337C2.29499 6.2193 2.43985 6.31599 2.56188 6.43793C2.68391 6.55986 2.78071 6.70465 2.84676 6.86402C2.91281 7.02338 2.9468 7.1942 2.9468 7.36671Z" fill="#9B9696" />
                                                                        </svg>
                                                                    </button>
                                                                     {value?.cluster_info?.nc_name} - {value?.cluster_info?.name}
                                                                </div>
                                                            </td>
                                                            <td>{inspect?.working_area_info?.wa_name}</td>
                                                            <td>{value?.cluster_info?.nc_code}</td>
                                                            <td>
                                                                {inspect?.ispector_info?.name}
                                                            </td>
                                                            <td className='status-box'>
                                                            <span className="dot_dropStatus" style={{ backgroundColor: value?.conformity_status}}></span>
                                                            <span>{getStatusColorCode(value?.conformity_status)}</span>
                                                            </td>
                                                            <td>
                                                                <div className="table_action_list">
                                                                    <a className="table_actionBtn" style={{cursor: "pointer"}} onClick={() => handleConformity(value?.id_not_conformity_detected, index + 1)}>
                                                                        <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M22.619 18.1552L6.65001 2.18517C6.01951 1.57864 5.17625 1.24363 4.30142 1.25211C3.42659 1.26059 2.58998 1.61188 1.97135 2.23051C1.35273 2.84914 1.00143 3.68574 0.992955 4.56058C0.984476 5.43541 1.31949 6.27866 1.92601 6.90917L17.9 22.8782C18.2644 23.2427 18.7286 23.4911 19.234 23.5922L24.361 24.6182L23.332 19.4892C23.231 18.9838 22.9835 18.5196 22.619 18.1552Z" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path>
                                                                            <path d="M10.188 4.83984L4.43103 10.0088" stroke="currentcolor" strokeWidth="1.5"></path>
                                                                        </svg>
                                                                    </a>
                                                                    <a className="table_actionBtn" style={{cursor: "pointer"}} onClick={() => handleDelete(value?.id_not_conformity_detected)}>
                                                                        <svg width="26" height="25" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <path d="M1.5 5.5138H24.859M10.844 11.3538V17.1938M15.516 11.3538V17.1938M3.836 5.5138H22.523L20.677 22.1218C20.6137 22.6934 20.3418 23.2215 19.9134 23.6052C19.485 23.9888 18.9301 24.2008 18.355 24.2008H8C7.42544 24.2001 6.87129 23.9877 6.44348 23.6042C6.01567 23.2206 5.74421 22.6929 5.681 22.1218L3.836 5.5138ZM7.743 2.1818C7.93182 1.78122 8.23061 1.44256 8.60455 1.20531C8.97848 0.968063 9.41215 0.841992 9.855 0.841797H16.5C16.9432 0.841612 17.3773 0.967505 17.7516 1.20478C18.1259 1.44205 18.425 1.78091 18.614 2.1818L20.184 5.5138H6.172L7.743 2.1818Z" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path>
                                                                        </svg>
                                                                    </a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}

                                                </tbody>
                                            </table>
                                            {
                                inspect?.conformity_info?.length === 0 ? (
                                    <h4 className='text-center my-4' style={{ color: '#ecad42' }}>Nessun record trovato</h4>
                                ) : null
                            }
                                        </div>
                                    </div>
                                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                        <div className="sezionePreviewInner">
                                            <div className="row g-4">
                                                {inspect?.conformity_info?.map((value, index) => (
                                                    value?.rz_not_conformity?.map((subValue, subIndex) => (
                                                        <div className="col-xxl-4 col-md-6 col-lg-6">
                                                            <div className="sezioneCard" key={`${index}-${subIndex}`}>
                                                                <div className="sezioneCardHead">
                                                                {/* {sectionId}.{index+1} */}
                                                                    <h4>Non conformità </h4>
                                                                    <div className="sezioneHeadLink">
                                                                        <a className="table_actionBtn" onClick={() => handleConformity(value?.id_not_conformity_detected,index+1)}>
                                                                            <svg width="24" height="24" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M22.619 18.1552L6.65001 2.18517C6.01951 1.57864 5.17625 1.24363 4.30142 1.25211C3.42659 1.26059 2.58998 1.61188 1.97135 2.23051C1.35273 2.84914 1.00143 3.68574 0.992955 4.56058C0.984476 5.43541 1.31949 6.27866 1.92601 6.90917L17.9 22.8782C18.2644 23.2427 18.7286 23.4911 19.234 23.5922L24.361 24.6182L23.332 19.4892C23.231 18.9838 22.9835 18.5196 22.619 18.1552Z" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path>
                                                                                <path d="M10.188 4.83984L4.43103 10.0088" stroke="currentcolor" strokeWidth="1.5"></path>
                                                                            </svg>
                                                                        </a>
                                                                        <a className="table_actionBtn" onClick={() => handleDelete(value?.id_not_conformity_detected)}>
                                                                            <svg width="24" height="24" viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                <path d="M1.5 5.5138H24.859M10.844 11.3538V17.1938M15.516 11.3538V17.1938M3.836 5.5138H22.523L20.677 22.1218C20.6137 22.6934 20.3418 23.2215 19.9134 23.6052C19.485 23.9888 18.9301 24.2008 18.355 24.2008H8C7.42544 24.2001 6.87129 23.9877 6.44348 23.6042C6.01567 23.2206 5.74421 22.6929 5.681 22.1218L3.836 5.5138ZM7.743 2.1818C7.93182 1.78122 8.23061 1.44256 8.60455 1.20531C8.97848 0.968063 9.41215 0.841992 9.855 0.841797H16.5C16.9432 0.841612 17.3773 0.967505 17.7516 1.20478C18.1259 1.44205 18.425 1.78091 18.614 2.1818L20.184 5.5138H6.172L7.743 2.1818Z" stroke="currentcolor" strokeWidth="1.5" strokeLinecap="round" stroke-linejoin="round"></path>
                                                                            </svg>
                                                                        </a>
                                                                    </div>
                                                                </div>
                                                                <div className="sezioneCardImg">
                                                                    <img 
                                                                    src={
                                                                        subValue?.snapShotImage_full_url
                                                                            ? subValue.snapShotImage_full_url
                                                                            : subValue?.originalImage_full_url
                                                                                ? subValue.originalImage_full_url
                                                                                : 'img/camera2.png'
                                                                    }
                                                                    alt="" />
                                                                </div>
                                                                <ul className="sezioneCardBody">

                                                                    <li><strong>{value?.cluster_info?.nc_code}</strong> {value?.cluster_info?.nc_name}</li>
                                                                    <li>Area Lavoro: {inspect?.working_area_info?.wa_name}</li>
                                                                    <li>Ispettore: {inspect?.ispector_info?.name}</li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    ))
                                                ))}
                                            </div>

                                            {
                                inspect?.conformity_info?.length === 0 ? (
                                    <h4 className='text-center my-4' style={{ color: '#ecad42' }}>Nessun record trovato</h4>
                                ) : null
                            }
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </div> :
                <div>
                    <ReportAdd data={inspect} setFlag={setFlag} getInspectConformity={getInspectConformity} sezioneIndex={sezioneIndex} />
                </div>
            }


        </>
    </div>
  )
}


// Add Report Component 
const ReportAdd = ({data, setFlag, getInspectConformity, sezioneIndex}) => {
  const fileInputRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(false)
  const [display, setDisplay] = useState(false)
  const [groupName, setGroupName] = useState('');
  const [subTitle, setSubTitle] = useState({})
  const [displayInspection, setDisplayInspection] = useState(false)
  const [defaultValue, setDefaultValue] = useState(null);
  const [notes, setNote] = useState("")
  const [audioFile, setAudioFile] = useState(null);
  const [audio_file_url, setAudio_file_url] = useState(null)
  const formData = new FormData();
  const [ai_notes, setAi_Notes] = useState("");
  const [dataStatus, setDataStatus] = useState(false);
  const [isSelectActive, setIsSelectActive] = useState(false);
  const [isSelectActive2, setIsSelectActive2] = useState(false);
  const [errorsForm1, setErrorsForm1] = useState({});
  const [errorsForm2, setErrorsForm2] = useState({});
  const [inspectionPoints,setInspectPoints ] = useState({})
  const [priority, setPriority] = useState("Alta");
  const [selectedColor, setSelectedColor] = useState("#E23115");
  const statusOptions = ["#E23115", "#F9AB26", "#22B735"];
  const [selectedArea, setSelectedArea] = useState(data?.working_area_info?.id_working_area);
  const { data: dropdownList } = useGetDropdownListQuery();
  const [validationErrors, setValidationErrors] = useState({});
  const [isgenerate, setIsGenerate] = useState(false)
  const [generatingField, setGeneratingField] = useState("");
  const workingListing = dropdownList?.data?.workingListing
  const [clientformData, setClientformData] = useState({
    date: null,
    commento: "",
  });
  const [clientformData2, setClientformData2] = useState({
    date: null,
    commento: "",
  });


  const [errorss, setErrorss] = useState({
    groupName: '',
})

const [getInspectionPoints] = useGetInspectionPointsMutation();
const [openAitext] = useOpenAitextMutation()

const fetchInspectionPoints = async () => {

    const response = await getInspectionPoints().unwrap();
    if (response.status === "SUCCESS") {
        setInspectPoints(response)
        return response
    }
}

useEffect(() => {
    fetchInspectionPoints();
}, [])

const validates = () => {
  const newErrors = {};
  
  if (!groupName.trim()) newErrors.groupName = 'Il nome è obbligatorio.';

  setErrorss(newErrors);
  return Object.keys(newErrors).length === 0;
};



// create inspection points
const [createInspection] = useCreateInspectionMutation();
const [updateArea] = useUpdateAreaMutation();
const location = useLocation();
const [addConformity ] = useAddConformityMutation();
  // create inspection point
  const handleCreateInspectionPoint = async () => {
    if(!validates()){
      return;
    }
      try {
          if(groupName !== ""){
          const response = await createInspection({
              body: {
                  name: groupName
              }
          }).unwrap();
          if (response.status === "SUCCESS") {
              toast.success(response?.message)
              setGroupName('')
              const cancelButton = document.querySelector('#aggiungiModal .modal_borderBtn');
            if (cancelButton) {
                cancelButton.click();
              }
              fetchInspectionPoints();
          }else{
            toast.error(response.message)
            setGroupName('')
          }
      }else{
          toast.error("Inspection point not be empty")
      }
      } catch (error) {
          setGroupName('')
      }
     
  }
  const handleToggle1 = () => {
      setDisplay(true)
      setDisplayInspection(false)
      setErrors((prev) => ({ ...prev, subTitle: null }));

  }

  // delete image file or audio file
  const handleAudio = () => {
      if (audio_file_url) {
        URL.revokeObjectURL(audio_file_url); // Revoke the URL to release memory
      }
      setAudioFile(null);
      setAudio_file_url(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input
      }
    };


    const [errors, setErrors] = useState({}); // State for validation errors

const validateFields = () => {
  const newErrors = {};
  if (subTitle?.id_cluster === undefined) {
    newErrors.subTitle = 'Non conformità Rilevata is required.';
  }


  if (notes === undefined) {
      newErrors.notes = 'notes is required.';
    }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0; // Return true if no errors
};
  // handleEdit 
  const handleEdit = async(shapes, snapshot_file, original_image_file, newTextData, texts) =>{
    setIsLoading(true)
       if (validateFields()) {
         formData.append("id_machinery", data?.id_machinery);
         formData.append("id_cluster", subTitle?.id_cluster);
         formData.append("id_code", subTitle?.nc_code);
         formData.append("id_inspection_point", defaultValue);
         formData.append("rz_not_conformity[inspectionnotes]", notes);
         formData.append(
           "rz_not_conformity[original_image]",
           original_image_file
         );
         formData.append("rz_not_conformity[snap_shot_image]", snapshot_file);
         formData.append(
           "rz_not_conformity[inspection_shape_data]",
           JSON.stringify(shapes)
         );
         if (audioFile !== null) {
           formData.append("rz_not_conformity[audio_notes]", audioFile);
         }
         formData.append("date_1", clientformData?.date);
         formData.append("date_2", clientformData2?.date);
         formData.append("comment_1", clientformData?.commento);
         formData.append("comment_2", clientformData2.commento);
         formData.append("priority", priority);
         formData.append("status", selectedColor)
         formData.append("rz_not_conformity[text_note]", newTextData ? newTextData : null)
         formData.append(
           "rz_not_conformity[ai_notes]",
           ai_notes !== "" ? ai_notes : null
         );
         formData.append("rz_not_conformity[polygon_text]", texts ? JSON.stringify(texts) : null)
         try {
           const response = await addConformity(formData).unwrap();

           if (response.status === "SUCCESS") {
             setIsLoading(false)
             getInspectConformity();
             setFlag(true);
             window.location.href = location.pathname.split('/').pop();;
             toast.success(response?.message);
           }
          else{
            setIsLoading(false)
             toast.error(response?.message);
           }
         } catch (error) {
          setIsLoading(false)
           toast.error(error.data.message);
         }
       }
  }

  if (isLoading) return <Loader />

  const handleNavigate = () =>{
      localStorage.setItem('mainMenuIndex',null)
      setFlag(true)
  }

  // handle autio file
  const handleChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type.startsWith('audio/')) {
        setAudioFile(file);
        setAudio_file_url(URL.createObjectURL(file));
      } 
    };


    const handleDateChange = (date) => {
        if (date) {
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          const formattedDate = `${year}/${month}/${day}`;
          clientformData["date"] = formattedDate;
          setClientformData({ ...clientformData, date: formattedDate });
          setIsSelectActive(true);
        } else {
          setIsSelectActive(false);
          setClientformData({ ...clientformData, date: date });
        }
      };
    
      const handleCommentoChange = (e) => {
        const { value } = e.target;
        setClientformData((prevState) => ({
          ...prevState,
          commento: value,
        }));
      };
    
      const handleDateChange2 = (date) => {
        if (date) {
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          const formattedDate = `${year}/${month}/${day}`;
          clientformData2["date"] = formattedDate;
          setClientformData2({ ...clientformData2, date: formattedDate });
          setIsSelectActive2(true);
        } else {
          setIsSelectActive2(false);
          setClientformData2({ ...clientformData2, date: date });
        }
      };
    
      const handleCommentoChange2 = (e) => {
        const { value } = e.target;
        setClientformData2((prevState) => ({
          ...prevState,
          commento: value,
        }));
      };


      const handleInputChange = (e, field) => {
        const { value } = e.target;

        // Update the respective state
        if (field === "notes") {
            setNote(value);
        } else if (field === "ai_notes") {
            setAi_Notes(value);
        }

        // Clear validation error for the field when the user types
        setValidationErrors((prevErrors) => ({
            ...prevErrors,
            [field]: value.trim() ? "" : prevErrors[field], // Remove error if value is entered
        }));
    }
    
    const generateText = async (inputText, setter, field) => {
      let errors = {}; // Object to store validation errors
  
      if (!notes.trim() && field === "notes") {
          errors.notes = "Input must not be empty.";
      }
  
      if (!ai_notes.trim() && field === "ai_notes") {
          errors.ai_notes = "Input must not be empty.";
      }
  
      // If there are errors, update state and stop execution
      if (Object.keys(errors).length > 0) {
          setValidationErrors(errors);
          return;
      }
  
      setIsGenerate(true); // Set generating state to true
      setGeneratingField(field); // Set the field that's being generated
  
      try {
          const res = await openAitext({body: { text: inputText }}).unwrap();
          setter(res?.data || ""); // Ensure a valid fallback
  
          if (res.status === "SUCCESS") {
              setIsGenerate(false);
              setGeneratingField(""); // Reset the generating field after success
          }
      } catch (err) {
          toast.error("Something went wrong");
          setIsGenerate(false);
          setGeneratingField(""); // Reset the generating field after error
      }
  };
  

      const handleChangePriorityStatus = async (eventOrValue, type) => {
        let value;

        if (type === "priority") {
            value = eventOrValue.target.value; // Extract priority value
            setPriority(value);
        } else if (type === "status") {
            value = eventOrValue; // Directly use the color code for status
            setSelectedColor(value);
        }

    }
;
  

    const handleChangearea = async (event) => {
      setSelectedArea(event.target.value);
      const areaId = event.target.value

      await updateArea({
          id: data?.id_machinery,
          body: {
              type: "area",
              value: parseInt(areaId)
          }
      }).unwrap().then((res) => {
          toast.success(res.message)
      }).catch((err) => console.log(err))
  };

  return (
    <>
      <div className="">
        <div className="container-fluid p-0">
          <a href="javascript:void(0);" className="dashIconFold" id="foldBtn">
            <div className="folded">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="17"
                viewBox="0 0 6 10"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0.603669 0.690378C0.802481 0.497088 1.12482 0.497088 1.32363 0.690377L5.39636 4.64997C5.49183 4.74279 5.54547 4.86869 5.54547 4.99996C5.54547 5.13122 5.49183 5.25712 5.39636 5.34994L1.32363 9.30953C1.12482 9.50282 0.802481 9.50282 0.603669 9.30953C0.404856 9.11624 0.404856 8.80286 0.603669 8.60957L4.31641 4.99996L0.603669 1.39034C0.404856 1.19705 0.404856 0.883667 0.603669 0.690378Z"
                  fill="#ECAD42"
                />
              </svg>
            </div>
          </a>
          <div className="contentBox">
            <a className="close-iconBtn" style={{cursor: "Pointer"}} onClick={handleNavigate}>
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.05096 1.10498C1.21899 0.936596 1.41859 0.803006 1.63831 0.711857C1.85804 0.620708 2.09358 0.573792 2.33146 0.573792C2.56934 0.573792 2.80489 0.620708 3.02462 0.711857C3.24434 0.803006 3.44393 0.936596 3.61196 1.10498L13.184 10.681L22.756 1.10498C23.0968 0.771233 23.5555 0.58543 24.0325 0.587931C24.5095 0.590431 24.9663 0.781033 25.3036 1.11834C25.6409 1.45564 25.8315 1.9124 25.834 2.38941C25.8365 2.86642 25.6507 3.32516 25.317 3.66598L15.741 13.238L25.317 22.81C25.6507 23.1508 25.8365 23.6095 25.834 24.0865C25.8315 24.5636 25.6409 25.0203 25.3036 25.3576C24.9663 25.6949 24.5095 25.8855 24.0325 25.888C23.5555 25.8905 23.0968 25.7047 22.756 25.371L13.184 15.795L3.61196 25.371C3.27114 25.7047 2.81241 25.8905 2.3354 25.888C1.85838 25.8855 1.40162 25.6949 1.06432 25.3576C0.727017 25.0203 0.536415 24.5636 0.533915 24.0865C0.531414 23.6095 0.717216 23.1508 1.05096 22.81L10.627 13.238L1.05096 3.66598C0.88258 3.49795 0.748989 3.29836 0.657841 3.07863C0.566692 2.85891 0.519775 2.62336 0.519775 2.38548C0.519775 2.1476 0.566692 1.91205 0.657841 1.69233C0.748989 1.4726 0.88258 1.27301 1.05096 1.10498Z"
                  fill="currentcolor"
                />
              </svg>
            </a>
            <div className="reportHeader">
              <div>Ispezione | {data?.order_info?.client}</div>
              <div>{data?.order_info?.order_code}</div>
              <div>
                <a className="finalizza_btn">
                  Finalizza Sezione {sezioneIndex}
                </a>
              </div>
            </div>
            <div className="row">
              <div className=" col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    value={data?.machinery_info?.brand_name}
                  />
                  <label htmlFor="floatingInput">Elemento di Ispezione</label>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingInput"
                    value={data?.ispector_info?.name}
                  />
                  <label htmlFor="floatingInput">Ispettore</label>
                </div>
              </div>{" "}
            </div>
            <div className="report_innerBox">
              <div className="report_appliedBox">
                <h4 className="reportNormativa">Non conformità</h4>

                <div className="form-input-block px-0">
                  <form>
                    <div className="row gy-4 row-gap">
                      <div className="col-md-12">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="floatingInput"
                            value={
                              subTitle?.nc_name === undefined
                                ? "non conformita"
                                : `${subTitle?.nc_name}-${subTitle?.name}`
                            }
                          />
                          <label htmlFor="floatingInput">
                            Non conformita Rilavata
                          </label>
                          <div
                            className="inputRightIcon inputRightIcon_track"
                            onClick={() => handleToggle1()}
                          >
                            <svg
                              width="32"
                              height="32"
                              viewBox="0 0 35 35"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M31.3164 24.8518L9.5914 3.12583C8.73232 2.3092 7.5882 1.86048 6.403 1.87536C5.21781 1.89023 4.08531 2.36752 3.24699 3.20545C2.40867 4.04338 1.93085 5.17565 1.91542 6.36084C1.9 7.54603 2.34818 8.69036 3.1644 9.54983L24.8934 31.2768C25.389 31.7724 26.0202 32.1103 26.7074 32.2478L33.6824 33.6478L32.2824 26.6708C32.1448 25.9836 31.807 25.3524 31.3114 24.8568L31.3164 24.8518Z"
                                stroke="#ECAD42"
                                strokeWidth="2"
                                strokeLinecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M14.4033 6.73682L6.57129 13.7688"
                                stroke="#ECAD42"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>

                          {errors.subTitle && (
                            <div style={{ color: "red" }}>
                              {errors.subTitle}
                            </div>
                          )}
                        </div>
                      </div>

                      {display && (
                        <NonConformity2
                          setDisplay={setDisplay}
                          setSubTitle={setSubTitle}
                        />
                      )}

                      <div className="col-xxl-3 col-md-6">
                        <div class="form-floating">
                          <select
                            class="form-select right_arrowBottomm form-control"
                            id="floatingSelect"
                            aria-label="Floating label select example"
                            value={selectedArea}
                            onChange={handleChangearea}
                          >
                            <option value={0} selected>
                              Area
                            </option>
                            {workingListing?.map((item) => (
                              <option value={item?.id_working_area}>
                                {item?.wa_name}
                              </option>
                            ))}
                          </select>
                          <label for="floatingSelect">Area Lavoro</label>
                        </div>
                      </div>

                      <div className="col-xxl-3 col-md-6">
                        <div className="form-floating mb-3 pb-1">
                          <select
                            className="form-select right_arrowBottom form-control"
                            id="floatingSelect"
                            value={defaultValue}
                            aria-label="Floating label select example"
                            onChange={(e) => {
                              setDefaultValue(e.target.value);
                              setErrors((prev) => ({
                                ...prev,
                                defaultValue: null,
                              }));
                            }}
                          >
                            <option value={0} selected>
                              Selezionare
                            </option>
                            {inspectionPoints?.data?.map((value, index) => (
                              <option
                                key={index}
                                value={value?.id_inspection_point}
                              >
                                {value?.name}
                              </option>
                            ))}
                          </select>
                          <label htmlFor="floatingSelect">
                            Punto di ispezione
                          </label>
                          <div
                            className="inputRightIcon"
                            data-bs-toggle="modal"
                            data-bs-target="#aggiungiModal"
                          >
                            <svg
                              onClick={() => setDisplay(false)}
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4 12H20M12 4V20"
                                stroke="#000000"
                                strokeWidth="2"
                                strokeLinecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </div>

                          {errors.defaultValue && (
                            <div style={{ color: "red" }}>
                              {errors.defaultValue}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-xxl-3 col-md-6">
                        <div className="form-floating">
                          <select
                            className="form-select right_arrowBottomm form-control"
                            id="floatingSelect"
                            aria-label="Floating label select example"
                            value={priority}
                            onChange={(e) =>
                              handleChangePriorityStatus(e, "priority")
                            } // Calls handleChange with type "priority"
                          >
                            <option value="Alta">Alta</option>
                            <option value="Medio">Medio</option>
                            <option value="Basso">Basso</option>
                          </select>
                          <label htmlFor="floatingSelect">
                            Priorità Intervento
                          </label>
                        </div>
                      </div>

                      <div className="col-xxl-3 col-md-6">
                        <div className="status_dropdownBox">
                          <label className="status_label_box">
                            Status conformità
                          </label>
                          <div className="dropdown">
                            <button
                              className="action-btn dropdown-toggle"
                              type="button"
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                              data-bs-display="static"
                            >
                              <span
                                className="dot_dropStatus"
                                style={{ backgroundColor: selectedColor }}
                              ></span>
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              {statusOptions.map((color) => (
                                <li
                                  key={color}
                                  onClick={() =>
                                    handleChangePriorityStatus(color, "status")
                                  }
                                >
                                  <span
                                    className="dot_dropStatus"
                                    style={{ backgroundColor: color }}
                                  ></span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="col-12  mb-4">
                        <div class="col-xl-12">
                          <div class="generate_aiBox">
                            <label class="status_label_box">
                              <svg
                                width="25"
                                height="25"
                                viewBox="0 0 29 29"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M15.899 2.67483C15.7317 2.3483 15.4774 2.07427 15.1644 1.88292C14.8513 1.69158 14.4915 1.59033 14.1245 1.59033C13.7576 1.59033 13.3978 1.69158 13.0847 1.88292C12.7716 2.07427 12.5174 2.3483 12.35 2.67483L1.38503 24.6058C1.23217 24.9093 1.15939 25.2468 1.17362 25.5863C1.18785 25.9259 1.28861 26.2561 1.46634 26.5457C1.64406 26.8354 1.89286 27.0748 2.1891 27.2412C2.48535 27.4077 2.81922 27.4957 3.15903 27.4968H25.091C25.4308 27.4957 25.7647 27.4077 26.061 27.2412C26.3572 27.0748 26.606 26.8354 26.7837 26.5457C26.9614 26.2561 27.0622 25.9259 27.0764 25.5863C27.0907 25.2468 27.0179 24.9093 26.865 24.6058L15.899 2.67483Z"
                                  stroke="#252525"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  stroke-linejoin="round"
                                />
                                <path
                                  d="M16.1011 9.19567L15.8795 17.3434H13.8L13.5727 9.19567H16.1011ZM14.8398 20.9798C14.4648 20.9798 14.1428 20.8472 13.8738 20.582C13.6049 20.3131 13.4723 19.9911 13.4761 19.6161C13.4723 19.2449 13.6049 18.9267 13.8738 18.6616C14.1428 18.3964 14.4648 18.2638 14.8398 18.2638C15.1996 18.2638 15.5159 18.3964 15.7886 18.6616C16.0613 18.9267 16.1996 19.2449 16.2034 19.6161C16.1996 19.8661 16.1333 20.0953 16.0045 20.3036C15.8795 20.5082 15.7148 20.6729 15.5102 20.7979C15.3057 20.9192 15.0822 20.9798 14.8398 20.9798Z"
                                  fill="#252525"
                                />
                              </svg>
                              Aspetto Critico{" "}
                            </label>
                            <button
                              type="button"
                              class="generate_aiBtn"
                              onClick={() =>
                                generateText(notes, setNote, "notes")
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="25"
                                height="23"
                                viewBox="0 0 27 25"
                                fill="none"
                              >
                                <path
                                  d="M8.76415 15.3717C8.55167 15.3342 8.3592 15.223 8.22053 15.0577C8.08186 14.8924 8.00586 14.6835 8.00586 14.4677C8.00586 14.252 8.08186 14.0431 8.22053 13.8778C8.3592 13.7125 8.55167 13.6013 8.76415 13.5637C10.5594 13.252 12.2212 12.4126 13.5374 11.1525C14.8536 9.89238 15.7646 8.26876 16.1541 6.48875L16.2161 6.21075C16.2626 5.99743 16.3804 5.80632 16.5501 5.66894C16.7198 5.53157 16.9312 5.45614 17.1495 5.45509C17.3679 5.45404 17.58 5.52744 17.751 5.66318C17.922 5.79892 18.0416 5.98888 18.0901 6.20175L18.1621 6.52775C18.5668 8.29956 19.4861 9.91225 20.8045 11.1632C22.1229 12.4142 23.7816 13.2476 25.5721 13.5587C25.7865 13.5958 25.9809 13.7074 26.1209 13.8738C26.261 14.0402 26.3379 14.2507 26.3379 14.4682C26.3379 14.6858 26.261 14.8963 26.1209 15.0627C25.9809 15.2291 25.7865 15.3407 25.5721 15.3777C23.7816 15.6889 22.1229 16.5223 20.8045 17.7733C19.4861 19.0242 18.5668 20.6369 18.1621 22.4087L18.0901 22.7317C18.0416 22.9446 17.922 23.1346 17.751 23.2703C17.58 23.4061 17.3679 23.4795 17.1495 23.4784C16.9312 23.4774 16.7198 23.4019 16.5501 23.2646C16.3804 23.1272 16.2626 22.9361 16.2161 22.7227L16.1551 22.4457C15.7656 20.6657 14.8546 19.0421 13.5384 17.782C12.2222 16.5219 10.5604 15.6825 8.76515 15.3707L8.76415 15.3717Z"
                                  fill="white"
                                />
                                <path
                                  d="M0.275589 21.5319C0.198764 21.5178 0.129316 21.4772 0.0793228 21.4172C0.0293294 21.3572 0.00195312 21.2816 0.00195312 21.2034C0.00195312 21.1253 0.0293294 21.0497 0.0793228 20.9897C0.129316 20.9297 0.198764 20.8891 0.275589 20.8749C0.928402 20.7615 1.53263 20.4562 2.0112 19.9979C2.48976 19.5397 2.82098 18.9492 2.96259 18.3019L2.98459 18.2019C3.00155 18.1241 3.04462 18.0544 3.10665 18.0045C3.16868 17.9545 3.24594 17.9272 3.32559 17.9272C3.40524 17.9272 3.4825 17.9545 3.54453 18.0045C3.60656 18.0544 3.64963 18.1241 3.66659 18.2019L3.69259 18.3209C3.8408 18.9642 4.17559 19.5495 4.65501 20.0033C5.13443 20.4571 5.73714 20.7593 6.38759 20.8719C6.46551 20.8855 6.53614 20.9262 6.58704 20.9867C6.63793 21.0473 6.66584 21.1239 6.66584 21.2029C6.66584 21.282 6.63793 21.3586 6.58704 21.4192C6.53614 21.4797 6.46551 21.5204 6.38759 21.5339C5.73636 21.6471 5.13309 21.9501 4.65359 22.4051C4.17409 22.86 3.83975 23.4466 3.69259 24.091L3.66659 24.209C3.64963 24.2868 3.60656 24.3565 3.54453 24.4064C3.4825 24.4564 3.40524 24.4837 3.32559 24.4837C3.24594 24.4837 3.16868 24.4564 3.10665 24.4064C3.04462 24.3565 3.00155 24.2868 2.98459 24.209L2.96259 24.1089C2.82168 23.4609 2.49078 22.8696 2.01216 22.4106C1.53354 21.9516 0.92893 21.6457 0.275589 21.5319Z"
                                  fill="white"
                                />
                                <path
                                  d="M0.470102 7.01481C0.338436 6.99177 0.219112 6.92304 0.133125 6.8207C0.0471388 6.71836 0 6.58898 0 6.45531C0 6.32164 0.0471388 6.19226 0.133125 6.08992C0.219112 5.98758 0.338436 5.91885 0.470102 5.89581C1.5813 5.70292 2.60984 5.18336 3.4245 4.40343C4.23916 3.6235 4.80301 2.61855 5.0441 1.51681L5.0821 1.34381C5.11072 1.2116 5.18361 1.09313 5.28871 1.00797C5.39381 0.922811 5.52483 0.876077 5.6601 0.875494C5.79536 0.874911 5.92678 0.920514 6.03261 1.00476C6.13844 1.08901 6.21235 1.20686 6.2421 1.33881L6.2871 1.53881C6.53754 2.63543 7.10646 3.63358 7.9224 4.40788C8.73833 5.18218 9.76488 5.6981 10.8731 5.89081C11.0052 5.91452 11.1247 5.9839 11.2108 6.08681C11.2969 6.18973 11.344 6.31964 11.344 6.45381C11.344 6.58799 11.2969 6.71789 11.2108 6.82081C11.1247 6.92372 11.0052 6.9931 10.8731 7.01681C9.76488 7.20953 8.73833 7.72544 7.9224 8.49974C7.10646 9.27404 6.53754 10.2722 6.2871 11.3688L6.2421 11.5688C6.21235 11.7008 6.13844 11.8186 6.03261 11.9029C5.92678 11.9871 5.79536 12.0327 5.6601 12.0321C5.52483 12.0315 5.39381 11.9848 5.28871 11.8997C5.18361 11.8145 5.11072 11.696 5.0821 11.5638L5.0441 11.3918C4.80301 10.2901 4.23916 9.28512 3.4245 8.50519C2.60984 7.72526 1.5813 7.20571 0.470102 7.01281V7.01481Z"
                                  fill="white"
                                />
                              </svg>

                              {generatingField === "notes"
                                ? "generating...."
                                : "Genera con AI"}
                            </button>
                          </div>
                          <div class="form-floating">
                            <textarea
                              class="form-control paddRightIn textareaFixH"
                              id="floatingInput"
                              value={notes}
                              onChange={(e) => {
                                handleInputChange(e, "notes");
                              }}
                            />
                            {validationErrors.notes && (
                              <div style={{ color: "red" }}>
                                {validationErrors.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        <div class="col-xl-12">
                          <div class="generate_aiBox">
                            <label class="status_label_box">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 26 26"
                                fill="none"
                              >
                                <path
                                  d="M24.4449 9.33582L16.6759 1.56682C16.4791 1.3708 16.2126 1.26074 15.9349 1.26074C15.6571 1.26074 15.3907 1.3708 15.1939 1.56682L10.1149 6.64982C9.72974 6.60676 9.34244 6.58572 8.95489 6.58682C6.58824 6.58317 4.29125 7.38752 2.44389 8.86682C2.32961 8.95925 2.23601 9.07464 2.16915 9.20553C2.10228 9.33641 2.06364 9.47988 2.05572 9.62665C2.0478 9.77341 2.07079 9.9202 2.12318 10.0575C2.17558 10.1948 2.25622 10.3196 2.35989 10.4238L8.08889 16.1528L1.29689 22.9368C1.21381 23.0196 1.16248 23.129 1.15189 23.2458L1.04489 24.4188C1.03803 24.4885 1.04587 24.5588 1.06791 24.6252C1.08994 24.6917 1.12568 24.7527 1.17282 24.8045C1.21995 24.8562 1.27742 24.8975 1.34151 24.9257C1.40561 24.9538 1.47489 24.9682 1.54489 24.9678C1.56052 24.9694 1.57626 24.9694 1.59189 24.9678L2.76489 24.8608C2.88171 24.8502 2.99109 24.7989 3.07389 24.7158L9.86489 17.9248L15.5939 23.6538C15.6981 23.7577 15.823 23.8386 15.9604 23.8911C16.0979 23.9436 16.2449 23.9666 16.3918 23.9586C16.5388 23.9505 16.6824 23.9117 16.8133 23.8445C16.9443 23.7774 17.0596 23.6835 17.1519 23.5688C18.0076 22.4982 18.6435 21.2693 19.0233 19.9524C19.403 18.6355 19.5191 17.2566 19.3649 15.8948L24.4439 10.8158C24.6393 10.6199 24.749 10.3545 24.749 10.0778C24.749 9.80112 24.6393 9.53572 24.4439 9.33982L24.4449 9.33582Z"
                                  stroke="#252525"
                                  strokeWidth="2"
                                />
                              </svg>
                              Adeguamento proposto{" "}
                            </label>
                            <button
                              type="button"
                              class="generate_aiBtn"
                              onClick={() =>
                                generateText(ai_notes, setAi_Notes, "ai_notes")
                              }
                            >
                              <svg
                                fill="#fff"
                                version="1.1"
                                id="Capa_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                width="24"
                                height="24"
                                viewBox="0 0 861.143 861.143"
                                xmlSpace="preserve"
                              >
                                <g>
                                  <path
                                    d="M456.213,730.502c-34.613,0-68.516-5.831-100.765-17.331c-31.171-11.115-60.159-27.272-86.161-48.024
                                                                        c-52.042-41.536-89.225-99.817-104.693-164.109c-6.783-28.189-35.133-45.546-63.325-38.761
                                                                        c-28.19,6.783-45.544,35.135-38.761,63.325c10.557,43.872,28.304,85.42,52.748,123.492c23.995,37.372,53.782,70.384,88.534,98.118
                                                                        c35.098,28.013,74.258,49.833,116.393,64.858c43.6,15.547,89.367,23.431,136.031,23.431c54.643,0,107.678-10.713,157.633-31.843
                                                                        c48.225-20.396,91.523-49.587,128.695-86.758s66.361-80.471,86.76-128.696c21.129-49.956,31.842-102.99,31.842-157.633
                                                                        c0-54.642-10.713-107.678-31.842-157.633c-20.398-48.225-49.588-91.525-86.76-128.696S662.07,77.881,613.846,57.484
                                                                        c-49.955-21.13-102.99-31.843-157.633-31.843c-79.907,0-157.211,23.258-223.558,67.259c-52.833,35.04-96.38,81.557-127.655,135.996
                                                                        v-84.329c0-28.995-23.505-52.5-52.5-52.5S0,115.572,0,144.567v198.884c0,28.995,23.505,52.5,52.5,52.5h196.21
                                                                        c28.994,0,52.5-23.505,52.5-52.5c0-28.995-23.506-52.5-52.5-52.5h-58.027c23.445-44.539,57.708-82.493,100.006-110.546
                                                                        c49.088-32.555,106.324-49.763,165.522-49.763c80.113,0,155.434,31.198,212.084,87.848c56.648,56.65,87.848,131.967,87.848,212.081
                                                                        s-31.197,155.434-87.848,212.083S536.326,730.502,456.213,730.502z"
                                  />
                                </g>
                              </svg>
                              {generatingField === "ai_notes"
                                ? "generating...."
                                : "Rigenera AI"}
                            </button>
                          </div>
                          <div class="form-floating">
                            <textarea
                              className="form-control paddRightIn textareaFixH"
                              id="floatingInput"
                              value={ai_notes}
                              onChange={(e) => {
                                handleInputChange(e, "ai_notes");
                              }}
                            />
                            {validationErrors.ai_notes && (
                              <div style={{ color: "red" }}>
                                {validationErrors.ai_notes}
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          {audio_file_url && (
                            <div className="col-md-12 w-100">
                              <label className="status_label_box">
                                Audio file
                              </label>
                              <div className="form-floating">
                                <div className="d-flex align-items-center gap-5">
                                  <audio controls src={audio_file_url} />
                                  <svg
                                    onClick={handleAudio}
                                    className="table_actionBtn"
                                    width="26"
                                    height="25"
                                    viewBox="0 0 26 25"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    role="button"
                                    aria-label="Delete audio file"
                                  >
                                    <path
                                      d="M1.5 5.5138H24.859M10.844 11.3538V17.1938M15.516 11.3538V17.1938M3.836 5.5138H22.523L20.677 22.1218C20.6137 22.6934 20.3418 23.2215 19.9134 23.6052C19.485 23.9888 18.9301 24.2008 18.355 24.2008H8C7.42544 24.2001 6.87129 23.9877 6.44348 23.6042C6.01567 23.2206 5.74421 22.6929 5.681 22.1218L3.836 5.5138ZM7.743 2.1818C7.93182 1.78122 8.23061 1.44256 8.60455 1.20531C8.97848 0.968063 9.41215 0.841992 9.855 0.841797H16.5C16.9432 0.841612 17.3773 0.967505 17.7516 1.20478C18.1259 1.44205 18.425 1.78091 18.614 2.1818L20.184 5.5138H6.172L7.743 2.1818Z"
                                      stroke="currentcolor"
                                      strokeWidth="1.5"
                                      strokeLinejoin="round"
                                    />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          )}

                          <input
                            type="file"
                            accept="audio/*"
                            id="audioUpload"
                            onChange={handleChange}
                            ref={fileInputRef}
                            style={{ display: "none" }}
                          />
                          <label
                            style={{cursor: "pointer"}}
                            for="audioUpload"
                            className="btn-primary btn-default text-center"
                          >
                            <span className="me-2">
                              <svg
                                width="18"
                                height="19"
                                viewBox="0 0 24 25"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M13.438 10.7791V0.327148H10.452V10.7791H0V13.7651H10.452V24.2171H13.438V13.7651H23.89V10.7791H13.438Z"
                                  fill="currentcolor"
                                ></path>
                              </svg>
                            </span>{" "}
                            Carica audio
                          </label>

                          <div className="records_photography_box space-0">
                            <div className="records_photographyImg">
                              <EditSection2 handleEdit={handleEdit} />
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* ))} */}

                      <div
                        className={`form-floating ${
                          isSelectActive ? "active-floating-select" : ""
                        }`}
                      >
                        <div className="commento_inputBox">
                          <label className="status_label_box">
                            Note a seguito di collaudo{" "}
                          </label>
                          <div className="select_datePickerFlex">
                            <div className="datePicker_label">Data :</div>
                            <div className="position-relative">
                              {!errorsForm1?.date && (
                                <div>
                                  {!data?.date_1 && (
                                    <div className="ctm-label2 text-center">
                                      dd /mm /yyyy
                                    </div>
                                  )}
                                </div>  
                              )}
                              <MyDatePicker
                                data={data?.date_1}
                                onDateChange={handleDateChange}
                              />
                              {errorsForm1?.date && (
                                <div className="text-danger">
                                  {errorsForm1?.date}
                                </div>
                              )}
                            </div>
                          </div>
                          <div class="form-floating">
                            <input
                              type="text"
                              value={clientformData?.commento}
                              className="form-control"
                              onChange={handleCommentoChange}
                              id="floatingCommento"
                            />
                              <span className="commento-text">Commento :</span>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`form-floating ${
                          isSelectActive2 ? "active-floating-select" : ""
                        }`}
                        style={{ marginTop: "10px" }}
                      >
                        <div className="commento_inputBox">
                          <label className="status_label_box">
                            Note a seguito di collaudo{" "}
                          </label>
                          <div className="select_datePickerFlex">
                            <div className="datePicker_label">Data :</div>
                            <div className="position-relative">
                              {!errorsForm2?.date && (
                                <div>
                                  {!data?.date_2 && (
                                    <div className="ctm-label2 text-center">
                                       dd /mm /yyyy
                                    </div>
                                  )}
                                </div>
                              )}
                              <MyDatePicker
                                data={data?.date_2}
                                onDateChange={handleDateChange2}
                              />
                              {errorsForm2?.date && (
                                <div className="text-danger">
                                  {errorsForm2?.date}
                                </div>
                              )}
                            </div>
                          </div>
                          <div class="form-floating">
                            <input
                              type="text"
                              value={clientformData2?.commento}
                              className="form-control"
                              onChange={handleCommentoChange2}
                              id="floatingCommento"
                              
                            />
                              <span className="commento-text">Commento :</span>

                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade modalTheme"
        id="aggiungiModal"
        tabindex="-1"
        aria-labelledby="aggiungiModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="aggiungiModalLabel">
                Aggiungi nuova gruppo
              </h5>
            </div>
            <div className="modal-body">
              <div className="form-input-block p-0">
                <form action="#!">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-floating ">
                        <input
                          type="text"
                          className={`form-control ${errorss.groupName ? 'is-invalid' : ''}`}
                          id="floatingInput"
                          value={groupName}
                          onChange={(e) => {
                            setGroupName(e.target.value);
                            if (errorss.groupName) {
                                setErrorss((prev) => ({ ...prev, groupName: null }));
                            }
                        }}
                          placeholder="Name"
                        />
                        <label htmlFor="floatingInput">Nome</label>
                        {errorss?.groupName && <div className="invalid-feedback">{errorss.groupName}</div>}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={handleCreateInspectionPoint}
                type="button"
                className="modal_solidBtn"
              >
                Confermare
              </button>
              <button
                type="button"
                className="modal_borderBtn"
                data-bs-dismiss="modal"
              >
                Cancellare
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


// Edit Section2
const EditSection2 = ({handleEdit }) => {
    const canvasRef = useRef(null);
  
  const [capturedFile1, setCapturedFile1] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState([]);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);
  const [image, setImage] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [imagefile, setImageFile] = useState(null)
  const [newTextData, setNewTextData] = useState("")
  const [isWriteMode, setIsWriteMode] = useState(false);
  const [texts, setTexts] = useState([]);
  const CLOSE_DISTANCE = 10;
  
  
  
    // Load the original image
    useEffect(() => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = originalImageUrl === null ? "img/camera2.png" : originalImageUrl;
  
  
      img.onload = () => setImage(img);
    }, [ originalImageUrl]);
  
  
    const redraw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (image) ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  
      shapes.forEach((shape, index) => {
        const isSelected = index === selectedShapeIndex;
        shape.points.forEach((point) => drawPoint(ctx, point.x, point.y, shape.withLines ? "black" : "red"));
        drawLines(ctx, shape.points, shape.withLines ? "black" : "red");
        if (shape.withLines) fillWithDiagonalLines(ctx, shape.points, isSelected);
      });
  
      currentShape.forEach((point) => drawPoint(ctx, point.x, point.y, "black"));
      if (currentShape.length > 1) drawLines(ctx, currentShape, "black");
  
      texts.forEach(({ text, x, y }) => {
        ctx.fillStyle = "blue";
        ctx.font = "18px Arial";
        ctx.fillText(text, x, y);
      });
    };

    useEffect(() => redraw(), [shapes, currentShape, image, selectedShapeIndex, texts]);
  
    const drawPoint = (ctx, x, y, color) => {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };
  
    const drawLines = (ctx, points, color) => {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => ctx.lineTo(point.x, point.y));
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    };
  
    const fillWithDiagonalLines = (ctx, points, isSelected) => {
      if (points.length < 3) return;
  
      const patternCanvas = document.createElement("canvas");
      const patternCtx = patternCanvas.getContext("2d");
      patternCanvas.width = 10;
      patternCanvas.height = 10;
      patternCtx.fillStyle = isSelected ? "rgba(0, 128, 0, 0.5)" : "rgba(255, 255, 0, 0.5)";
      patternCtx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
  
      const pattern = ctx.createPattern(patternCanvas, "repeat");
  
      ctx.save();
      ctx.fillStyle = pattern;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
  
   
    const handleCanvasClick = async (e) => {
      if (!imagefile) {
        Swal.fire({
          title: "Nessuna immagine disponibile",
          text: "Carica un'immagine prima di disegnare sulla tela.",
          icon: "warning",
        });
        return;
      }
  
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
  
      if (isWriteMode) {
        const clickedTextIndex = texts.findIndex((t) => {
          const textWidth = 100;
          const textHeight = 20;
          return x >= t.x && x <= t.x + textWidth && y <= t.y && y >= t.y - textHeight;
        });
  
        if (clickedTextIndex !== -1) {
          const { isConfirmed, isDenied } = await Swal.fire({
            title: `Cosa vuoi fare con questo testo?`,
            icon: "question",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Modificare",
            denyButtonText: "Eliminare",
            cancelButtonText: "Cancellare",
          });
  
          if (isDenied) {
            setTexts((prev) => prev.filter((_, i) => i !== clickedTextIndex));
          } else if (isConfirmed) {
            const { value: newText } = await Swal.fire({
              title: "Modifica testo",
              input: "text",
              inputValue: texts[clickedTextIndex].text,
              showCancelButton: true,
            });
  
            if (newText) {
              setTexts((prev) =>
                prev.map((t, i) =>
                  i === clickedTextIndex ? { ...t, text: newText } : t
                )
              );
            }
          }
          return;
        }
  
        const { value: text } = await Swal.fire({
          title: "Inserisci il testo",
            input: "text",
            inputPlaceholder: "Scrivi qualcosa...",
            cancelButtonText: "Cancellare",
            showCancelButton: true,
        });
  
        if (text) {
          setTexts((prev) => [...prev, { text, x, y }]);
        }
  
        return;
      }
  
      const clickedShapeIndex = shapes.findIndex((shape) => isPointInShape({ x, y }, shape.points));
      if (clickedShapeIndex >= 0) {
        setSelectedShapeIndex(clickedShapeIndex);
      } else {
        setCurrentShape((prev) => [...prev, { x, y }]);
      }
    };

    const isPointInShape = (point, shapePoints) => {
      let inside = false;
      for (let i = 0, j = shapePoints.length - 1; i < shapePoints.length; j = i++) {
        const xi = shapePoints[i].x, yi = shapePoints[i].y;
        const xj = shapePoints[j].x, yj = shapePoints[j].y;
        if ((yi > point.y) !== (yj > point.y) && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    };

    const deleteSelectedShape = async () => {
      if (selectedShapeIndex === null) return;
      const result = await Swal.fire({
        title: "Sei sicuro?",
        text: "Vuoi eliminare la forma selezionata?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sì, cancellalo!",
        cancelButtonText: "Cancellare",
      });
      if (result.isConfirmed) {
        setShapes((prev) => prev.filter((_, index) => index !== selectedShapeIndex));
        setSelectedShapeIndex(null);
      } else {
        setSelectedShapeIndex(null);
      }
    };
  
    useEffect(() => {
      if (selectedShapeIndex !== null) deleteSelectedShape();
    }, [selectedShapeIndex]);
  
    const handleChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setOriginalImageUrl(URL.createObjectURL(file));
        setImageFile(file)
      }
    };
  
    
    return (
      <>
      <div className='mt-5'>
      <SignPad setNewTextData={setNewTextData}/>
      </div>
      <div className="col-lg-12 mb-4 mt-4">
      <div className="records_photography_box records_photography_section space-0">
        <div>
          <canvas ref={canvasRef} width="999" height="600" onClick={handleCanvasClick} />
        </div>
        <div className="right_photographyBtn">
          <ul className="right_photographyList">

          <li>
              <div className="right_photoItem">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 256 256"
                  width="26px"
                  height="26px"
                  fillRule="nonzero"
                >
                  <g
                    fill="#ed9604"
                    fillRule="nonzero"
                    stroke="none"
                    strokeWidth="1"
                    strokeLinecap="butt"
                    strokeLinejoin="miter"
                    strokeMiterlimit="10"
                    fontFamily="none"
                    fontWeight="none"
                    fontSize="none"
                    textAnchor="none"
                    style={{ mixBlendMode: 'normal' }}
                  >
                    <g transform="scale(10.66667,10.66667)">
                      <path d="M4,4c-1.09425,0 -2,0.90575 -2,2v12c0,1.09426 0.90575,2 2,2h16c1.09426,0 2,-0.90574 2,-2v-10c0,-1.09425 -0.90574,-2 -2,-2h-8l-2,-2zM4,6h5.17188l2,2h8.82813v10h-16z"></path>
                    </g>
                  </g>
                </svg>
                <label htmlFor="fileupload">Carica file</label>
                <input type="file" id="fileupload" style={{ display: "none" }} onChange={handleChange} />
              </div>
            </li>

            <li onClick={() => {

              if (currentShape.length > 2) {
                setShapes([...shapes, { points: [...currentShape, currentShape[0]], withLines: false }])
                setCurrentShape([]);
              } else {
                setCurrentShape([]);
              }
            }
            }>
              <div className="right_photoItem">
                <svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#ECAD42" className="bi bi-octagon">
                  <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z" />
                </svg>
                Poligono</div>
            </li>
            <li
              onClick={() => {
                if (currentShape.length > 2) {
                  const newShape = {
                    points: [...currentShape, currentShape[0]], // Close the shape
                    withLines: true, // Fill with yellow color
                  };

                  setShapes((prevShapes) => [...prevShapes, newShape]); // Update state properly
                  setCurrentShape([]); // Clear current shape after adding
                } else {
                  setCurrentShape([]);
                }
              }}
            >
              <div className="right_photoItem">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g opacity="0.2">
                    <path d="M17.2716 1.75H8.72842C8.60531 1.75 8.4834 1.77425 8.36966 1.82136C8.25591 1.86848 8.15256 1.93753 8.06551 2.02459L2.02459 8.06551C1.93753 8.15256 1.86848 8.25591 1.82136 8.36966C1.77425 8.4834 1.75 8.60531 1.75 8.72842V17.2716C1.75 17.3947 1.77425 17.5166 1.82136 17.6303C1.86848 17.7441 1.93753 17.8474 2.02459 17.9345L8.06551 23.9754C8.15256 24.0625 8.25591 24.1315 8.36966 24.1786C8.4834 24.2258 8.60531 24.25 8.72842 24.25H17.2716C17.3947 24.25 17.5166 24.2258 17.6303 24.1786C17.7441 24.1315 17.8474 24.0625 17.9345 23.9754L23.9754 17.9345C24.0625 17.8474 24.1315 17.7441 24.1786 17.6303C24.2258 17.5166 24.25 17.3947 24.25 17.2716V8.72842C24.25 8.60531 24.2258 8.4834 24.1786 8.36966C24.1315 8.25591 24.0625 8.15256 23.9754 8.06551L17.9345 2.02459C17.8474 1.93753 17.7441 1.86848 17.6303 1.82136C17.5166 1.77425 17.3947 1.75 17.2716 1.75Z" fill="#ECAD42" />
                  </g>
                  <path d="M17.2716 25.1875H8.72844C8.4821 25.1882 8.23807 25.14 8.01048 25.0457C7.78289 24.9514 7.57626 24.813 7.40256 24.6383L1.36171 18.5974C1.18704 18.4237 1.04856 18.2171 0.954289 17.9895C0.860018 17.7619 0.811827 17.5179 0.812507 17.2716V8.72844C0.811831 8.4821 0.860026 8.23807 0.954302 8.01048C1.04858 7.78289 1.18706 7.57626 1.36174 7.40256L7.40262 1.36171C7.57631 1.18704 7.78293 1.04856 8.01051 0.954289C8.23809 0.860018 8.48211 0.811827 8.72844 0.812507H17.2716C17.5179 0.811831 17.7619 0.860026 17.9895 0.954302C18.2171 1.04858 18.4237 1.18706 18.5975 1.36174L24.6383 7.40262C24.813 7.57631 24.9515 7.78293 25.0457 8.01051C25.14 8.23809 25.1882 8.48211 25.1875 8.72844V17.2716C25.1882 17.5179 25.14 17.7619 25.0457 17.9895C24.9514 18.2171 24.813 18.4237 24.6383 18.5975L18.5974 24.6383C18.4237 24.813 18.2171 24.9515 17.9895 25.0457C17.7619 25.14 17.5179 25.1882 17.2716 25.1875ZM8.72844 2.68751L2.68754 8.72841L2.68751 17.2716L8.72841 23.3125L17.2716 23.3125L23.3125 17.2716L23.3125 8.72844L17.2716 2.68751H8.72844Z" fill="#ECAD42" />
                </svg>
                Poligono Pieno</div>
            </li>


            <li onClick={() => setIsWriteMode((prev) => !prev)}>
              <div className="right_photoItem" style={{ color: isWriteMode ? "green" : "inherit" }}>
                ✍️ Modalità testo {isWriteMode ? "(On)" : ""}
              </div>
            </li>
          </ul>
          <div className="mt-auto">


            <button
              type="button"
              className="save_photoBtn"
              onClick={() => {
                const canvas = canvasRef.current;
                if (!canvas) return;

                canvas.toBlob((blob) => {
                  if (blob) {
                    const file = new File([blob], "canvas_snapshot.png", { type: "image/png" });

                    setCapturedFile1(file);

                    // Call handleEdit inside the callback after file is created
                    handleEdit(shapes, file, imagefile, newTextData, texts);
                  }
                });
              }}
            >
              <svg width="17" height="17" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12.353 0.146L13.853 1.646L14 2V13.5L13.5 14H0.5L0 13.5V0.5L0.5 0H12L12.353 0.146ZM1 1V13H13V2.208L11.793 1H10V5H3V1H1ZM7 1V4H9V1H7Z" fill="white" />
              </svg>
              Salva
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
    );
  };


// NonConformity2
const NonConformity2 = ({ setSubTitle, setDisplay }) => {
  const imagePaths = [
    "img/finalizza1.png",
    "img/finalizza2.png",
    "img/finalizza3.png",
    "img/finalizza4.png",
    "img/finalizza5.png",
    "img/finalizza6.png",
  ];

    const {data, isLoading, refetch} = useGetConformityTypesQuery({
        endpoints: '/api/v1/conformity/ncType'
    });
    
    const [conformaty, setConformaty] = useState(true);
    const [cluserData, setClusterData] = useState([]);
  
    const showClusters = (clusters) => {
      setClusterData(clusters);
      setConformaty(false);
    };
  
    const handleCluster = (clusterValues) => {
      showClusters(clusterValues);
    };
  
    if (isLoading) return <div>Loading ....</div>;
  
    return (
      <>
        {conformaty ? (
          <div className="layout">
            <div className="report_innerBox">
              <div className="row g-4">
                {data?.data.map((value, index) => (
                  <div key={index} className="col-lg-4 col-sm-4 col-6 col-xxl-2">
                    <a className="d-block">
                      <div style={{cursor: "pointer"}} className="finalizza_cardBox" onClick={() => handleCluster(value)}>
                      <img src={imagePaths[index] || "img/default.png"} alt={`Step ${index + 1}`} />
                        <h3>{value?.nc_name}</h3>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
         
          <ConformityDetected
            clusterdata={cluserData}
            setDisplay={setDisplay}
            setSubTitle={setSubTitle}
            fetchedClusterPoints={refetch}
          />
        )}
      </>
    );
  }

 // Conformity Detected
 const ConformityDetected = ({ clusterdata, setDisplay, setSubTitle, fetchedClusterPoints }) => {
    const [pointData, setPointData] = useState({
        name: clusterdata?.cluster?.[0]?.name || '',
        priority: clusterdata?.cluster?.[0]?.priority || null,
    });

    const [errors, setErrors] = useState({
        name: '',
        priority: '',
    });

    const [name, setName] = useState("");
    const [priority, setPriority] = useState()
    

    const [createCluster] = useCreateClusterMutation();

    useEffect(() => {
        // Set the first cluster item as the default selected pointData on component mount
        if (clusterdata?.cluster?.length > 0) {
            setPointData({
                name: clusterdata.cluster[0].name,
                priority: clusterdata.cluster[0].priority,
            });
            setSubTitle(clusterdata.cluster[0]);
        }
    }, [clusterdata]);

    const handlePointData = (points) => {
        setPointData(points);
        setSubTitle(points);
        setDisplay(false);
    };

    const validate = () => {
      const newErrors = {};
      if (!name.trim()) newErrors.name = 'Il nome è obbligatorio.';
      if (!priority || isNaN(priority) || Number(priority) < 0) {
          newErrors.priority = 'È richiesta la priorità.';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
  };

    const handleCreateCluster = async () => {
        if (!validate()) {
            return;
        }

        try {
            const response = await createCluster({
                url: `/api/v1/conformity/create-cluster`,
                method: "POST",
                body: {
                    name: name,
                    priority: priority,
                    id_not_conformity_type: clusterdata?.id_not_conformity_type,
                },
            }).unwrap();
            
            
            if (response.status === "SUCCESS") {
                toast.success(response.message);
                setName("")
                setPriority("")
                
                const cancelButton = document.querySelector('#aggiungiModal2 .modal-footer .modal_borderBtn');
                if (cancelButton) {
                  cancelButton.click();
                }
                setDisplay(false)
                fetchedClusterPoints();

            
            }else{
              toast.error(response.message);
              setName("")
              setPriority("")
            }
        } catch (error) {
            console.log(error);
            toast.error(error.data.message);
        }
    };

    return (
        <>
            <div className="layout">
                <div className="contentBox">
                    <div className="report_innerBox">
                        <div className="report_appliedBox">
                            <div className="rischi_innerBox">
                            <a className="close-iconBtn" onClick={() => setDisplay(false)}>
                            <svg width="26" height="26" viewBox="0 0 26 26"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M1.05096 1.10498C1.21899 0.936596 1.41859 0.803006 1.63831 0.711857C1.85804 0.620708 2.09358 0.573792 2.33146 0.573792C2.56934 0.573792 2.80489 0.620708 3.02462 0.711857C3.24434 0.803006 3.44393 0.936596 3.61196 1.10498L13.184 10.681L22.756 1.10498C23.0968 0.771233 23.5555 0.58543 24.0325 0.587931C24.5095 0.590431 24.9663 0.781033 25.3036 1.11834C25.6409 1.45564 25.8315 1.9124 25.834 2.38941C25.8365 2.86642 25.6507 3.32516 25.317 3.66598L15.741 13.238L25.317 22.81C25.6507 23.1508 25.8365 23.6095 25.834 24.0865C25.8315 24.5636 25.6409 25.0203 25.3036 25.3576C24.9663 25.6949 24.5095 25.8855 24.0325 25.888C23.5555 25.8905 23.0968 25.7047 22.756 25.371L13.184 15.795L3.61196 25.371C3.27114 25.7047 2.81241 25.8905 2.3354 25.888C1.85838 25.8855 1.40162 25.6949 1.06432 25.3576C0.727017 25.0203 0.536415 24.5636 0.533915 24.0865C0.531414 23.6095 0.717216 23.1508 1.05096 22.81L10.627 13.238L1.05096 3.66598C0.88258 3.49795 0.748989 3.29836 0.657841 3.07863C0.566692 2.85891 0.519775 2.62336 0.519775 2.38548C0.519775 2.1476 0.566692 1.91205 0.657841 1.69233C0.748989 1.4726 0.88258 1.27301 1.05096 1.10498Z"
                                    fill="currentcolor" />
                            </svg>
                        </a>
                                <h2 className="rischi_title">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.9998 9.00023V13.0002M11.9998 17.0002H12.0098M10.6151 3.89195L2.39019 18.0986C1.93398 18.8866 1.70588 19.2806 1.73959 19.6039C1.769 19.886 1.91677 20.1423 2.14613 20.309C2.40908 20.5002 2.86435 20.5002 3.77487 20.5002H20.2246C21.1352 20.5002 21.5904 20.5002 21.8534 20.309C22.0827 20.1423 22.2305 19.886 22.2599 19.6039C22.2936 19.2806 22.0655 18.8866 21.6093 18.0986L13.3844 3.89195C12.9299 3.10679 12.7026 2.71421 12.4061 2.58235C12.1474 2.46734 11.8521 2.46734 11.5935 2.58235C11.2969 2.71421 11.0696 3.10679 10.6151 3.89195Z" stroke="#ECAD42" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {clusterdata?.nc_name}
                                </h2>
                                <ul className="rischi_checkBox">
                                    {clusterdata?.cluster?.map((value, index) => (
                                        <li key={index} className="rischi_chack" onClick={() => handlePointData(value)}>
                                            <input
                                                type="radio"
                                                name="risk"
                                                id={`risk-${index}`}
                                                checked={pointData.name === value.name}
                                                readOnly
                                            />
                                            <label htmlFor={`risk-${index}`}>{value?.name}</label>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    className="generate_aiBtn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#aggiungiModal2">
                                    + Aggiungi nuovo cluster
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

             {/* Modal for adding new cluster */}
             <div className="modal fade modalTheme" id="aggiungiModal2" tabIndex="-1" aria-labelledby="aggiungiModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="aggiungiModalLabel">Aggiungi nuova gruppo</h5>
                        </div>
                        <div className="modal-body">
                            <div className="form-input-block p-0">
                                <form>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="form-floating">
                                                <input
                                                    type="text"
                                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                                    id="floatingInput"
                                                    value={name}
                                                    placeholder="Name"
                                                    onChange={(e) => {
                                                          setName(e.target.value);
                                                          if (errors.name) {
                                                              setErrors((prev) => ({ ...prev, name: null }));
                                                          }
                                                      }}

                                                />
                                                <label htmlFor="floatingInput">Nome</label>
                                                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <div className="form-floating mb-3">
                                                <input
                                                    type="number"
                                                    className={`form-control ${errors.priority ? 'is-invalid' : ''}`}
                                                    id="floatingInput1"
                                                    value={priority}
                                                    placeholder="Priority"
                                                    onChange={(e) => {
                                                      setPriority(e.target.value);
                                                      if (errors.priority) {
                                                          setErrors((prev) => ({ ...prev, priority: null }));
                                                      }
                                                  }}
                                                />
                                                <label htmlFor="floatingInput1">Priorità</label>
                                                {errors.priority && <div className="invalid-feedback">{errors.priority}</div>}
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                onClick={handleCreateCluster}
                                type="button"
                                className="modal_solidBtn"
                                >
                                Confermare
                            </button>
                            <button type="button" className="modal_borderBtn" data-bs-dismiss="modal">
                            Cancellare
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReportSectionElement