// @ts-nocheck
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import Swal from "sweetalert2";
import "react-datepicker/dist/react-datepicker.css";
import MyDatePicker from "../DatePicker";
import {
  useCreateInspectionMutation,
  useDeleteConformityMutation,
  useEditConformityMutation,
  useGetConformityDataMutation,
  useGetDropdownListQuery,
  useGetInspectionPointsMutation,
  useOpenAitextMutation,
  useRecapConformityMutation,
  useUpdateAreaMutation,
  useUpdateStatusPriorityMutation,
} from "../../services/apiSlice";
import Loader from "../../lib/loader/loader";
import { setPageOpen } from "../../store/pageSlice";
import EditSection from "../EditSection";
import EditSection2 from "../EditSection2";
import NonConformity from "../NonConformity";
export default function ReportEdit({ getApi }) {
  const childId = sessionStorage.getItem("submenu");
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [display, setDisplay] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [displayInspection, setDisplayInspection] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  const [notes, setNote] = useState("");
  const [ai_notes, setAi_Note] = useState("");
  const [dataStatus, setDataStatus] = useState(false);
  const [isSelectActive, setIsSelectActive] = useState(false);
  const [isSelectActive2, setIsSelectActive2] = useState(false);
  const [errorsForm1, setErrorsForm1] = useState({});
  const [errorsForm2, setErrorsForm2] = useState({});
  const [inspectionPoints, setInspectPoints] = useState({})
  const [clientformData, setClientformData] = useState({
    date: null,
    commento: "",
  });
  const [clientformData2, setClientformData2] = useState({
    date: null,
    commento: "",
  });
  const [flag, setFlag] = useState(false);
  const formData = new FormData();
  const submainIndex = useSelector((state) => state.page.subSectionIndex)
  // capture file

  const [getConformityData] = useGetConformityDataMutation();
  const [openAitext] = useOpenAitextMutation()
  // fetch inspection points
  const [getInspectionPoints] = useGetInspectionPointsMutation()
  const [notesData, setNotesData] = useState([]);
  const { data: dropdownList } = useGetDropdownListQuery();
  const workingListing = dropdownList?.data?.workingListing
  const [priority, setPriority] = useState("Alta");
  const [selectedColor, setSelectedColor] = useState("#E23115");
  const [selectedArea, setSelectedArea] = useState();
  const [updateArea] = useUpdateAreaMutation();
  const [updateStatusPriority] = useUpdateStatusPriorityMutation()
  const [generating, setGenerating] = useState({ index: null, field: null });
  const [validationErrors, setValidationErrors] = useState({});
  const statusOptions = ["#E23115", "#F9AB26", "#22B735"];

  const [errorss, setErrorss] = useState({
    groupName: '',
  })

  const fetchInspectionPoints = async () => {

    const response = await getInspectionPoints().unwrap();
    if (response.status === "SUCCESS") {
      setInspectPoints(response)
      return response
    }
  }

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await getConformityData({
        id: childId
      }).unwrap();

      if (response.status === "SUCCESS") {
        setData(response);

        setSelectedArea(response?.working_area_info?.id_working_area || {})
        setSelectedColor(response?.conformity_status)
        setPriority(response?.priority)

        if (response?.rz_not_conformity) {
          setNotesData(response?.rz_not_conformity?.map(item => ({
            note: item?.inspectionnotes || "",
            ai_note: item?.ai_notes || ""
          })));
        }
        setSubTitle(response?.cluster_info);
        setIsLoading(false);
        setClientformData({
          ...clientformData,
          date: response?.date_1,
          commento: response?.comment_1,
        });
        setClientformData2({
          ...clientformData2,
          date: response?.date_2,
          commento: response?.comment_2,
        });
        const newdata = await fetchInspectionPoints()
        const defaultOption = newdata?.data?.find(
          (point) =>
            point.id_inspection_point ===
            response?.inspection_point_info?.id_inspection_point
        );
        if (defaultOption) {
          setDefaultValue(defaultOption.id_inspection_point.toString());
        }
      }
      setDataStatus(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [childId, dataStatus]);

  const [createInspection] = useCreateInspectionMutation();

  const validates = () => {
    const newErrors = {};

    if (!groupName.trim()) newErrors.groupName = 'Il nome è obbligatorio.';

    setErrorss(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // create inspection point
  const handleCreateInspectionPoint = async () => {
    if (!validates()) {
      return;
    }
    try {
      const response = await createInspection({
        body: {
          name: groupName,
        },
      }).unwrap();
      if (response.status === "SUCCESS") {
        toast.success(response?.message);
        setGroupName("");
        fetchInspectionPoints()
        const cancelButton = document.querySelector('#aggiungiModal .modal_borderBtn');
        if (cancelButton) {
          cancelButton.click();
        }
      }else{
        toast.error(response?.message);
        setGroupName("");
      }

    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
      setGroupName("");
     
    }
  };
  const handleToggle1 = () => {
    setDisplay(true);
    setDisplayInspection(false);
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

  const [deleteConformity] = useDeleteConformityMutation()

  // delete image file or audio file
  const handleImage = async (id_not_conformity_detail, fileType) => {
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
    try {
      if (result.isConfirmed) {
        const response = await deleteConformity({
          url: `/api/v1/conformity/delete-conformity/${data?.id_not_conformity_detected}`,
          method: "DELETE",
          body: {
            type: fileType,
            id_not_conformity_detail: id_not_conformity_detail
          }
        }).unwrap();
        if (response.status === "SUCCESS") {
          setData(response)
          toast.success(response?.message)
          fetchData();
        }else{
          toast.error(response?.message)
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message)
    }
  };

  const [editConformity] = useEditConformityMutation();

  // handleEdit
  const handleEdit = async (
    index,
    note,
    id_not_conformity_detail,
    originalImage,
    shapes,
    file,
    original_image_file,
    audioFile,
    newTextData,
    texts
  ) => {
    setIsLoading(true);
    const selectedNote = notesData[index]?.note || note;  // Get note from state or fallback
    const selectedAiNote = notesData[index]?.ai_note || null;
    formData.append("id_not_conformity_detail", id_not_conformity_detail);
    formData.append("id_machinery", data?.id_machinery);
    formData.append("id_cluster", subTitle?.id_cluster);
    if (
      data?.inspection_point_info?.id_inspection_point !==
      Number(defaultValue) ||
      data?.inspection_point_info?.id_inspection_point !== null
    ) {
      if (Number(defaultValue) !== 0) {
        formData.append("id_inspection_point", defaultValue);
      }
    }
    formData.append("id_code", subTitle?.nc_code);
    formData.append(
      "rz_not_conformity[inspectionnotes]", selectedNote
    );
    formData.append(
      "rz_not_conformity[original_image]",
      original_image_file === undefined || original_image_file === null ? originalImage : original_image_file
    );
    formData.append("rz_not_conformity[snap_shot_image]", file);
    formData.append(
      "rz_not_conformity[inspection_shape_data]",
      JSON.stringify(shapes)
    );
    if (audioFile !== null) {
      formData.append("rz_not_conformity[audio_notes]", audioFile);
    }
    formData.append("date_1", clientformData?.date === undefined ? null : clientformData?.date);
    formData.append("date_2", clientformData2?.date === undefined ? null : clientformData2?.date);
    formData.append("comment_1", clientformData?.commento === undefined ? null : clientformData?.commento);
    formData.append("comment_2", clientformData2.commento === undefined ? null : clientformData2?.commento);
    formData.append(
      "rz_not_conformity[ai_notes]", selectedAiNote);
    formData.append("rz_not_conformity[text_note]", newTextData ? newTextData : newTextData === null ? null : data?.['rz_not_conformity'][0]['text_note_full_url'])
    formData.append("rz_not_conformity[polygon_text]", texts ? JSON.stringify(texts) : null)
    try {
      const response = await editConformity({
        id: childId,
        body: formData, // Pass the FormData object here
      }).unwrap();

      if (response.status === "SUCCESS") {
        // setData(response)
        // fetchData();
        setDataStatus(true);
        setIsLoading(false);
        toast.success(response?.message);
      }
      else {
        toast.error(response?.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
      setIsLoading(false);
    }
  };

  const handleNavigate = () => {
    localStorage.setItem("mainMenuIndex", null);
    navigate(`${getApi.navigation}`);
  };

  const hanleToggleButton = () => {
    setFlag(!flag);
  };

  const handleTextChange = (index, field, value) => {
    setNotesData(prev => prev?.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const generateText = async (index, field) => {
    let errors = {};

    if (!notesData[index]?.[field]?.trim()) {
      errors[`${index}-${field}`] = "L'input non deve essere vuoto.";
    }

    // If validation errors exist, update state and stop execution
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setGenerating({ index, field });

    try {
      const response = await openAitext({ body: { text: notesData[index][field] } }).unwrap();

      setNotesData((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: response?.data } : item
        )
      );
      setGenerating(null);
    } catch (error) {
      toast.error("Something went wrong");
      setGenerating(null);
      console.log(error);
    }
  };

  const handleChangePriorityStatus = async (eventOrValue, type) => {
    try {
      let value;

      if (type === "priority") {
        value = eventOrValue.target.value; // Extract priority value
        setPriority(value);
      } else if (type === "status") {
        value = eventOrValue; // Directly use the color code for status
        setSelectedColor(value);
      }

      if (!value) return; // Prevent unnecessary API calls if value is empty

      // API call to update priority or status
      await updateStatusPriority({
        id: data?.id_not_conformity_detected,
        body: {
          type: type,
          value: value
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

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

  if (isLoading) return <Loader />;

  return (
    <>
      <div>
        <div className="container-fluid p-0">
          <a href="javascript:void(0);" className="dashIconFold" id="foldBtn" onClick={() => dispatch(setPageOpen(true))}>
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
                <a
                  onClick={() => navigate(`${getApi.navigation}`)}
                  className="finalizza_btn"
                >
                  Finalizza Sezione{" "}
                  {parseInt(submainIndex) === 0
                    ? sessionStorage.getItem("subIndex")
                    : submainIndex}
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
                <div className="reportNormativa d-flex justify-content-between align-items-center">
                  <h4>Non conformità</h4>
                  {flag ? (
                    <a style={{cursor: "pointer"}} onClick={hanleToggleButton} className="">
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
                  ) : (
                    <button
                      type="button"
                      onClick={hanleToggleButton}
                      className="btn btn-primary text-center w-auto"
                    >
                      Recap
                    </button>
                  )}
                </div>
                <div className="form-input-block px-0">
                  <form>
                    <div className="row gy-4 row-gap">
                      <div className="col-md-12">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="floatingInput"
                            value={`${subTitle?.nc_name}-${subTitle?.name}`}
                          />
                          <label htmlFor="floatingInput">
                            Non conformita Rilavata
                          </label>
                          <div
                            className="inputRightIcon"
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
                        </div>
                      </div>

                      {display && (
                        <NonConformity
                          setDisplay={setDisplay}
                          subTitle={subTitle}
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
                            <option value={0}>Area</option>
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
                            onChange={(e) => setDefaultValue(e.target.value)}
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
                            }
                          >
                            <option value={"Alta"}>Alta</option>
                            <option value={"Medio"}>Medio</option>
                            <option value={"Basso"}>Basso</option>
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

                      {flag ? (
                        <div>
                          <EditReportGenerate
                            data={data}
                            defaultValue={defaultValue}
                            subTitle={subTitle}
                            clientformData={clientformData}
                            clientformData2={clientformData2}
                            setFlag={setFlag}
                            setDataStatus={setDataStatus}
                          />
                        </div>
                      ) : (
                        <div>
                          {data?.rz_not_conformity?.map((value, index) => (
                            <div className="col-12  mb-4">
                              <div key={index}>
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
                                        generateText(index, "note")
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

                                      {generating?.index === index &&
                                        generating?.field === "note"
                                        ? "Generating..."
                                        : "Genera con AI"}
                                    </button>
                                  </div>
                                  <div class="form-floating">
                                    <textarea
                                      className="form-control paddRightIn textareaFixH"
                                      value={notesData[index]?.note}
                                      onChange={(e) =>
                                        handleTextChange(
                                          index,
                                          "note",
                                          e.target.value
                                        )
                                      }
                                    />

                                    {validationErrors[`${index}-note`] && (
                                      <div style={{ color: "red" }}>
                                        {validationErrors[`${index}-note`]}
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
                                        generateText(index, "ai_note")
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
                                      {generating?.index === index &&
                                        generating?.field === "ai_note"
                                        ? "Generating..."
                                        : "Rigenera AI"}
                                    </button>
                                  </div>
                                  <div class="form-floating">
                                    <textarea
                                      className="form-control paddRightIn textareaFixH"
                                      value={notesData[index]?.ai_note}
                                      onChange={(e) =>
                                        handleTextChange(
                                          index,
                                          "ai_note",
                                          e.target.value
                                        )
                                      }
                                    />
                                    {validationErrors[`${index}-ai_note`] && (
                                      <div style={{ color: "red" }}>
                                        {validationErrors[`${index}-ai_note`]}
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="records_photography_box space-0">
                                  <div className="records_photographyImg">
                                    <EditSection
                                      data={value}
                                      handleEdit={handleEdit}
                                      handleImage={handleImage}
                                      index={index}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                      <div
                        className={`form-floating ${isSelectActive ? "active-floating-select" : ""
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
                                      dd /mm/ yyyy
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
                          <div className="commento_placeAdd">
                            <div class="form-floating">
                              <input
                                type="text"
                                value={clientformData?.commento}
                                className="form-control"
                                onChange={handleCommentoChange}
                                id="floatingCommento"
                              />
                              <span className="commento_placeTag"> Commento :</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`form-floating ${isSelectActive2 ? "active-floating-select" : ""
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
                                      dd /mm/ yyyy
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
                          <div className="commento_placeAdd">
                            <div class="form-floating">
                              {/* <input type="text" value={commento2} class="form-control" onChange={(e) => setCommento2(e.target.value)} id="floatingCommento" placeholder="Commento :" /> */}
                              <input
                                type="text"
                                value={clientformData2?.commento}
                                className="form-control"
                                onChange={handleCommentoChange2}
                                id="floatingCommento"
                              />
                              <span className="commento_placeTag"> Commento :</span>
                            </div>
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

// Edit Report Generator
const EditReportGenerate = ({ data, defaultValue, subTitle, clientformData, clientformData2, setFlag, setDataStatus }) => {
  const [notes, setNote] = useState("")
  const [ai_notes, setAi_Notes] = useState("")
  const [audioFile, setAudioFile] = useState(null);
  const [audio_file_url, setAudio_file_url] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null);
  const formData = new FormData();
  const [recapConformity] = useRecapConformityMutation();
  const [openAitext] = useOpenAitextMutation()

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

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setAudio_file_url(URL.createObjectURL(file));
    }
  };

  const handleEdit = async (shapes, snapshot_file, original_image_file, newTextData, texts) => {
    setIsLoading(true)
    formData.append("id_machinery", data?.id_machinery);
    formData.append("id_cluster", subTitle?.id_cluster);
    formData.append("id_code", subTitle?.nc_code);
    formData.append("id_inspection_point", defaultValue);
    formData.append("rz_not_conformity[inspectionnotes]", notes);
    formData.append("rz_not_conformity[original_image]", original_image_file);
    formData.append("rz_not_conformity[snap_shot_image]", snapshot_file);
    formData.append("rz_not_conformity[inspection_shape_data]", JSON.stringify(shapes));
    if (audioFile !== null) {
      formData.append("rz_not_conformity[audio_notes]", audioFile);
    }
    formData.append("date_1", clientformData?.date);
    formData.append("date_2", clientformData2?.date);
    formData.append("comment_1", clientformData?.commento);
    formData.append("comment_2", clientformData2?.commento);
    formData.append("rz_not_conformity[ai_notes]", ai_notes !== "" ? ai_notes : null);
    formData.append("rz_not_conformity[text_note]", newTextData ? newTextData : null)
    formData.append("rz_not_conformity[polygon_text]", texts ? JSON.stringify(texts) : null)
    try {
      const response = await recapConformity({
        url: `/api/v1/conformity/recap-conformity/${data?.id_not_conformity_detected}`,
        method: "POST",
        body: formData, // Pass the FormData object here
      })
        .unwrap()

      if (response.status === "SUCCESS") {
        setIsLoading(false)
        // setData(response)
        setDataStatus(true)
        setFlag(false)
        toast.success(response?.message)
      }
      else {
        toast.error(response?.message)
        setIsLoading(false)
      }

    } catch (error) {
      console.log(error);
      setIsLoading(false)

    }

  }

  const generateText = async (inputText, setter) => {
    try {
      const res = await openAitext({ body: { text: inputText } }).unwrap();
      setter(res?.data || ""); // Ensure a valid fallback
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <Loader />

  return (
    <div>
      <div className="col-12  mb-4">
        <div className="col-xl-12">
          <div className="generate_aiBox">
            <label className="status_label_box">
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
              className="generate_aiBtn"
              onClick={() => generateText(notes, setNote)} disabled={!notes.trim()}
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
              Genera con AI
            </button>
          </div>
          <div className="form-floating">
            <textarea className="form-control paddRightIn textareaFixH" value={notes} onChange={(e) => {
              setNote(e.target.value)
            }} />
          </div>
        </div>

        <div className="col-xl-12">
          <div className="generate_aiBox">
            <label className="status_label_box">
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
              className="generate_aiBtn"
              onClick={() => generateText(ai_notes, setAi_Notes)} disabled={!ai_notes.trim()}
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
              Rigenera AI
            </button>
          </div>
          <div className="form-floating">
            <textarea className="form-control paddRightIn textareaFixH" id="floatingInput"
              value={ai_notes}
              onChange={(e) => setAi_Notes(e.target.value)} />
          </div>
        </div>

        <div>
          {audio_file_url && (
            <div className="col-md-12 w-100">
              <label className="status_label_box">Audio file</label>
              <div className="form-floating">
                <div className="d-flex align-items-center gap-md-4 gap-2">
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
            htmlFor="audioUpload"
            className="btn-primary btn-default text-center w-auto"
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
            <div className="records_photographyImg canvas-box">
              <EditSection2 handleEdit={handleEdit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
