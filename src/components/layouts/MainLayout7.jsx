import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import {
  useCreateInspectionMutation,
  useDeleInspectionMutation,
  useGetAddDropDownListQuery,
  useGetEditIDOrderQuery,
  useGetMachineryIDOrderQuery,
  useGetRzOrderQuery,
  useGetUserDetailsQuery,
  useUpdateInspectionMutation,
  useUploadExcelMutation,
  useCreateInspectionDataMutation,
} from "../../services/apiSlice";
import { toast } from "react-toastify";
import { useMemo } from "react";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import Loader from "../../lib/loader/loader";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "react-bootstrap";
import { findAreaByKeyPrefix } from "../../utils/helper";
const MainLayout6 = ({ areas }) => {
  const location = useLocation();
  const route = location.pathname.substring(1) || "/";
  const userId =
    localStorage.getItem("user_id") ?? sessionStorage.getItem("user_id");
  const modalRef = useRef(null);

  const id_order = localStorage.getItem("ispenzioEditID");
  const AddRoute = localStorage.getItem("addRoute");
  const [customDropDownData, setCustomDropDownData] = useState(false);
  const [isExcelPopupOpen, setIsExcelPopupOpen] = useState(false);

  const editIdIspenzio = localStorage.getItem("ispenzioEditID");
  const editroute = localStorage.getItem("editroute");

  const [MachineryID, setMachineryID] = useState(null);
  const [topologyName, setTopologyName] = useState(null);
  const [showNextForm, setShowNextForm] = useState(false);
  const [addButttonApi, setAddButtonApi] = useState(false);
  const [normeOptions, setNormeOptions] = useState([]);
  const [showFormData, setshowFormData] = useState([]);
  const [data, setData] = useState(null);

  const [status, setStatus] = useState({ id_state: 2, state: "Pianificata" });
  const [isSelectActive, setIsSelectActive] = useState(false);

  const [editShowFormData, setEditShowFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorsForm1, setErrorsForm1] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [editId, seteditId] = useState(null);
  const [upDateOrderId, setupDateOrderId] = useState(null);
  const [deletedInspectionId, setDeletedInspectionId] = useState(null);
  const [showButton, setshowButton] = useState(null);
  const [clientformData, setClientformData] = useState({
    description: "",
    created_by: "",
    client: "",
    orderId: "",
    date: null,
  });

  const [formData, setFormData] = useState({
    machineId: "",
    inspectorId: {},
    areaId: "",
    year: "",
    defaultValue: "",
    notes: "",
    normeId: "",
    norm_specification: [],
    ce: false,
    atex: false,
  });

  const validateForm = () => {
    let isValid = true;
    let validationErrors = {};
    if (!customDropDownData) {
      if (formData?.machineId === "") {
        validationErrors.topology = "È richiesto Machinrio";
        isValid = false;
      }
    }

    setErrors(validationErrors);

    return isValid;
  };

  const validateClientForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!clientformData.date) {
      newErrors.date = "La data è obbligatoria";
      isValid = false;
    }

    setErrorsForm1(newErrors);
    return isValid;
  };

  const filterApi = areas
    ?.filter(
      (item) => item?.props?.children?.props?.children?.props?.api != null
    )
    .reduce((acc, user) => {
      const key = user?.key;
      const function_name =
        user?.props?.children?.props?.children?.props?.api?.function_name;
      const apiMethod =
        user?.props?.children?.props?.children?.props?.api?.method_type;

      if (key.includes("EditArea3")) {
        acc.getDropDownUrl = function_name;
        acc.getDropdownMethod = apiMethod;
      }
      if (key.includes("FormArea8")) {
        acc.getRzOrderUrl = function_name;
        acc.getRzOrderMethod = apiMethod;
      }
      if (key.includes("EditArea14")) {
        acc.MachineryFilter = function_name;
      }
      if (key.includes("EditArea10")) {
        acc.MachineryFilterBrandName = function_name;
      }
      if (key.includes("EditButtonArea1")) {
        acc.createInspectionUrl = function_name;
        acc.CreateInspectionMethod = apiMethod;
      }
      if (key.includes("EditButtonArea4")) {
        acc.updateInspectionUrl = function_name;
        acc.updateInspectionMethod = apiMethod;
      }
      if (key?.includes("HeaderArea4-3")) {
        acc.userDetailsApi = function_name;
        acc.userDetailsApiMethod = apiMethod;
      }
      // EditButtonArea2-27
      if (key?.includes("EditButtonArea2-27")) {
        acc.importExcelApi = function_name;
        acc.importExcelApiMethod = apiMethod;
      }

      return acc;
    }, {});

  const apiData = areas?.find(
    (item) =>
      item?.props?.children?.props?.children?.[0]?.props?.areas
        ?.element_type === "table"
  );

  const getDeleteApi =
    apiData?.props?.children?.props?.children?.[0]?.props?.nestedElements?.reduce(
      (acc, data) => {
        const function_name =
          data?.props?.children?.props?.children?.props?.api?.function_name;
        const methodType =
          data?.props?.children?.props?.children?.props?.api?.method_type;

        if (function_name && acc === undefined) {
          return { deleteUrl: function_name, deleteMethod: methodType };
        }
        return acc;
      },
      undefined
    );

  // api calls
  const { data: dropdownList, refetch: refetchDropDown } =
    useGetAddDropDownListQuery(filterApi?.getDropDownUrl);
  const {
    data: rzOrderdetails,
    refetch,
    isFetching,
  } = useGetRzOrderQuery({
    url: filterApi?.getRzOrderUrl,
    params: (() => {
      if (route === AddRoute) return id_order;
      if (route === editroute) return editIdIspenzio;
      return id_order;
    })(),
    refetchOnMountOrArgChange: true,
  });

  const EditData = areas?.find(
    (item) =>
      item?.props?.children?.props?.children?.[0]?.props?.areas
        ?.element_type === "table"
  );

  const editApi =
    EditData?.props?.children?.props?.children?.[0]?.props?.areas?.table_columns?.reduce(
      (acc, data) => {
        const function_name = data?.table_fields?.function?.function_name;
        if (function_name && acc === undefined) {
          return function_name;
        }
        return acc;
      },
      undefined
    );

  const { data: editOrderData, isFetching: editedDataFetching } =
    useGetEditIDOrderQuery(editId ? { url: editApi, params: editId } : null, {
      cacheTime: 0,
    });

  const [deleInspection] = useDeleInspectionMutation();

  const [createInspectionData] = useCreateInspectionDataMutation();

  const [updateInspection] = useUpdateInspectionMutation();

  const ispectorListing = dropdownList?.data?.ispectorListing;

  const machineTypology = dropdownList?.data?.machineTypology;

  // data for state Listing for getting from dropdownList api
  const stateListing = dropdownList?.data?.stateListing;

  // data for working area listing getting from dropdown listing
  const workingListing = dropdownList?.data?.workingListing;

  const machineListing = dropdownList?.data?.machineListing;
  // data for normeListing getting from dropdown listing
  const normeListing = dropdownList?.data?.normeListing;

  useEffect(() => {
    const rzData = rzOrderdetails?.data;
    setClientformData({
      description: rzData?.description,
      created_by: rzData?.created_by_name,
      Machinery_created_id: rzData?.created_by,
      orderId: rzData?.id_order,
      client: rzData?.client,
      date: rzData?.inspections?.[0]?.calendar_info?.date,
    });

    const inspectorData = ispectorListing?.find(
      (item) => item?.id_user === parseInt(userId)
    );
    setFormData({
      ...formData,
      inspector_name: inspectorData?.name,
      inspectorId: { inspectorId: inspectorData?.id_ispector },
    });

    if (rzData?.id_state?.id_state !== 1) {
      setStatus(rzData?.id_state);
    } else {
      setStatus({ id_state: 2, state: "Pianificata" });
    }

    setshowFormData(rzOrderdetails);
    refetchDropDown();
  }, [rzOrderdetails]);

  const handleSelectIspector = (selectedOption) => {
    if (selectedOption) {
      setFormData({
        ...formData,
        inspectorId: selectedOption,
      });
    }
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();
    setEditShowFormData({});
    if (showButton == "edit") {
      return;
    }
    setshowButton("add");
    if (validateClientForm()) {
      setShowNextForm(true);
      setAddButtonApi(true);
      //   setSectionAdded(true);
    }
  };

  //selected change 2 input
  const handleSelectChange = (selectedOption) => {
    if (selectedOption?.__isNew__) {
      setCustomDropDownData(true);
      setMachineryID(selectedOption.value);
    }
    if (!selectedOption?.__isNew__) {
      setMachineryID(selectedOption?.value);
    }
  };

  const handleSelectMachineryTopology = (selectedOption) => {
    if (selectedOption?.__isNew__) {
      setNormeOptions(null);
      setMachineryID(null);
      setCustomDropDownData(true);
      setTopologyName(selectedOption.value);
    }
    if (!selectedOption?.__isNew__) {
      setMachineryID(null);
      setNormeOptions(null);
      setTopologyName(selectedOption.value);
    }
  };

  const handleSelectNormeListing = (selectedOption) => {
    setNormeOptions(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      norm_specification: selectedOption?.map((item) => item.value),
    }));
  };

  const handleSelectArea = (selectedOption) => {
    if (selectedOption) {
      setFormData({
        ...formData,
        areaId: selectedOption?.areaId,
      });
    }
  };

  const handleNotes = (e) => {
    setFormData({
      ...formData,
      notes: e.target.value,
    });
  };

  const handleModal = (id) => {
    setDeletedInspectionId(id);
    setShowModal(true);
  };

  const handleClose = () => {
    const inspectorData = ispectorListing?.find(
      (item) => item?.id_user === parseInt(userId)
    );
    setFormData({
      ...formData,
      topologyDefaultValues: "",
      normedefaultValue: "",
      defaultValue: "",
      brand_name: "",
      machineId: "",
      atex: "",
      ce: "",
      norm_specification: "",
      year: "",
      areaId: "",
      inspectorId: { inspectorId: inspectorData?.id_ispector },
      norm: "",
      topology: "",
      arealavoe_defaultvalue: "",
      notes: "",
      MachineryData: [],
      normeDellData: "",
    });
    seteditId(null);
    setMachineryID(null);
    setTopologyName("");
    setShowNextForm(false);
    setAddButtonApi(false);
    setshowButton(null);
    setErrors({});
  };

  // function for  delete inspection in add form
  const deleteInspection = async (id) => {
    try {
      const response = await deleInspection({
        url: getDeleteApi?.deleteUrl,
        method: getDeleteApi?.deleteMethod,
        id: deletedInspectionId,
      });

      if (response?.data?.status == "SUCCESS") {
        toast.success(response?.data?.message);
        handleClose();
        refetch();
        setShowModal(false);
        showNextForm(false);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Error deleting inspection:", error);
    }
  };

  const {
    data: MachineryData,
    isLoading,
    isError,
    refetch: machineryOrder,
  } = useGetMachineryIDOrderQuery(
    topologyName
      ? { url: filterApi.MachineryFilter, params: topologyName }
      : null
  );

  useMemo(() => {
    if (MachineryData) {
      setFormData({ ...formData, MachineryData: MachineryData });
    }
  }, [MachineryData]);

  const handleFormPage = (item, index) => {
    setShowNextForm(true);
    setshowButton("edit");
    setFormData([]);
    seteditId(item?.id_inspection);
    setupDateOrderId(item?.id_order);
    setMachineryID(item?.machinery_info?.brand_name);
    setTopologyName(item?.machinery_info?.typology);
  };

  const { data: normeDellData } = useGetMachineryIDOrderQuery(
    MachineryID
      ? { url: filterApi.MachineryFilterBrandName, params: MachineryID }
      : null,
    { cacheTime: 0 }
  );

  useMemo(() => {
    if (normeDellData) {
      setFormData({ ...formData, normeDellData: normeDellData });
    }
  }, [normeDellData]);

  const handleSelectMachinery = (selectedoption) => {
    if (selectedoption?.__isNew__) {
      setCustomDropDownData(true);
      setFormData({
        ...formData,
        machineName: selectedoption,
        name: selectedoption.label,
      });
    }
    if (!selectedoption?.__isNew__) {
      const filterMachineryIdData = normeDellData?.data?.find(
        (item) => item?.name == selectedoption?.value
      );

      setFormData({
        ...formData,
        year: filterMachineryIdData?.year ?? null,
        norm: filterMachineryIdData?.norm_specification ?? null,
        ce: filterMachineryIdData?.ce ?? null,
        atex: filterMachineryIdData?.atex ?? null,
        machineId: selectedoption.id_machinery_type,
      });
    }
  };

  // handleChange function for CheckBoX 1
  const handleChangeeditCheckBox1 = (e) => {
    setFormData((prev) => {
      return {
        ...prev,
        ce: e.target.checked,
      };
    });
  };

  // handleChange function for CheckBoX 2
  const handleChangeeditCheckBox2 = (e) => {
    setFormData((prev) => {
      return {
        ...prev,
        atex: e.target.checked,
      };
    });
  };

  // handleChange function for Year

  const handleYear = (e) => {
    setFormData((prev) => {
      return {
        ...prev,
        year: e.target.value,
      };
    });
  };
  // function for DateChange Function
  const handleDateChange = (date) => {
    if (date) {
      // Ensure that date is a valid Date object or string.
      const formattedDate = moment(date).isValid()
        ? moment(date).format("MMMM D, YYYY")
        : null;
      if (formattedDate) {
        setClientformData({ ...clientformData, date: formattedDate });
        setIsSelectActive(true);
      } else {
        setIsSelectActive(false);
      }
    } else {
      // If the date is null or undefined
      setIsSelectActive(false);
      setClientformData({ ...clientformData, date: null });
    }
  };

  useMemo(() => {
    if (editOrderData) {
      let datas = editOrderData?.data;
      setFormData([]);
      setMachineryID(datas?.brand_name);
      setTopologyName(datas?.typology);
      const machinaryInfo =
        formData?.MachineryData?.data?.find((machineData) => {
          return machineData?.id_machinery_type === datas?.id_machinery_type;
        }) || {};

      const newdata = {
        topologyDefaultValues: {
          value: datas?.typology,
          lable: datas?.typology,
        },
        normedefaultValue: {
          value: datas?.machine_name,
          label: datas?.machine_name,
        },
        defaultValue: { value: datas.brand_name, label: datas.brand_name },
        brand_name: datas.brand_name,
        inspectorId: { inspectorId: datas.id_ispector },
        machineId: datas?.id_machinery_type,
        atex: datas?.atex,
        ce: datas?.ce,
        inspector_name: datas?.ispector_name,
        norm_specification: machinaryInfo?.norm_specification,
        year: datas?.year,
        typology: datas?.typology,
        areaId: datas?.id_working_area,
        inspectionId: datas?.id_inspection,
        norm: [{ name: datas?.norms?.map((item) => item?.name) }],

        arealavoe_defaultvalue: {
          value: datas?.wa_name,
          label: datas?.wa_name,
        },
        notes: datas?.notes,
      };

      setStatus({ state: datas?.order_state, id_state: datas?.id_state });
      handleSelectMachinery({
        value: datas?.machine_name,
        label: datas?.machine_name,
      });
      setFormData(newdata);
    }
  }, [editOrderData]);

  // function for Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm() && showButton == "add") {
      return;
    }

    if (showButton === "add") {
      try {
        let body = {
          description: clientformData?.description || null,
          created_by: clientformData?.Machinery_created_id || null,
          id_order: clientformData?.orderId || null,
          date: moment(clientformData?.date).format("YYYY-MM-DD") || null,
          id_state: status?.id_state,
          inspections: [
            {
              id_machinery_type: formData.machineId || null,
              id_ispector: formData?.inspectorId.inspectorId || null,
              notes: formData?.notes || null,
              id_working_area: formData?.areaId || null,
              year: parseInt(formData?.year) || null,
              atex: formData?.atex || false,
              ce: formData?.ce || false,
            },
          ],
          newMachine: 0,
        };

        let newBody = {
          description: clientformData?.description,
          created_by: clientformData?.Machinery_created_id,
          id_order: clientformData?.orderId,
          date: moment(clientformData?.date).format("YYYY-MM-DD"),
          id_state: status?.id_state,
          inspections: [
            {
              // id_machinery_type: formData?.machineName?.label,
              id_machinery_type: null,
              id_ispector: formData?.inspectorId.inspectorId,
              notes: formData?.notes,
              id_working_area: formData?.areaId || null,
              //   year: parseInt(formData?.year) || null,
              //   atex: formData?.atex || false,
              //   ce: formData?.ce || false,

              newMachine: {
                name: formData?.name || null,
                brand_name: MachineryID || null,
                typology: topologyName,
                year: parseInt(formData?.year) || null,
                norm_specification:
                  formData?.norm_specification === ""
                    ? []
                    : formData?.norm_specification,
                atex: formData?.atex || false,
                ce: formData?.ce || false,
              },
            },
          ],
          newMachine: 1,
        };

        if (showButton == "add" || showButton == "excel") {
          const response = await createInspectionData({
            url: filterApi?.createInspectionUrl,
            method: filterApi.CreateInspectionMethod,
            body: customDropDownData ? newBody : body,
            //body:body,
          });
          if (response?.data?.status == "SUCCESS") {
            toast.success(response?.data?.message);
            setFormData({
              topologyDefaultValues: "",
              normedefaultValue: "",
              defaultValue: "",
              brand_name: "",
              typology: "",
              inspectorId: "",
              machineId: "",
              atex: "",
              ce: "",
              inspectorId: "",
              norm_specification: [],
              year: "",
              areaId: "",
              inspectionId: "",
              norm: "",
              arealavoe_defaultvalue: "",
              notes: "",
              normeDellData: [],
              MachineryData: [],
            });
            setNormeOptions([]);
            refetch();
            setMachineryID(null);
            setTopologyName(null);
            setNormeOptions([]);
            setCustomDropDownData(false);
            setLoading(false);
          } else {
            setLoading(false);
            toast.error(response?.data?.message);
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      if (showFormData?.data?.inspections?.length) {
        let clientNewData = { ...clientformData };

        // Ensure date format is correct
        if (clientNewData?.date) {
          const isFormatted = /^\d{4}-\d{2}-\d{2}$/.test(clientNewData.date);
          if (!isFormatted) {
            const [day, month, year] = clientNewData.date.split("/");
            const formattedDate = `${year}-${month}-${day}`;
            clientNewData.date = formattedDate;
          }
        }

        // Assign Machinery_created_id to created_by
        clientNewData.created_by = parseInt(clientNewData.Machinery_created_id);

        // Remove unnecessary fields
        delete clientNewData.Machinery_created_id;
        delete clientNewData.orderId;
        delete clientNewData.client;

        // Map inspections data
        const updatedFormData = showFormData?.data?.inspections?.map((item) =>
          Object.keys(item).reduce((acc, key) => {
            acc[key] = item[key] === "" ? null : item[key];
            return acc;
          }, {})
        );

        clientNewData.id_state = status.id_state;
        clientNewData.id_order = parseInt(id_order);
        clientNewData.newMachine = 0;
        clientNewData.inspections = updatedFormData.map(
          ({
            ispector_info,
            working_area_info,
            notes,
            id_inspection,
            machinery_info,
          }) => ({
            id_machinery_type: machinery_info?.id_machinery_type,
            id_ispector: ispector_info?.id_ispector,
            id_working_area: working_area_info.id_working_area || null,
            notes,
            id_inspection: id_inspection,
            ce: machinery_info?.ce,
            atex: machinery_info?.atex,
            year: machinery_info?.year,
          })
        );

        try {
          const response = await updateInspection({
            url: filterApi?.updateInspectionUrl,
            method: filterApi?.updateInspectionMethod,
            params: parseInt(id_order),
            body: clientNewData,
          }).unwrap();

          if (response?.status == "SUCCESS") {
            toast.success(response?.message);
            setLoading(false);
            setShowNextForm(false);
            setData(null);
            setNormeOptions([]);
            setMachineryID(null);
            setTopologyName(null);
            setNormeOptions([]);
            seteditId(null);
            setCustomDropDownData(false);
            setshowButton(null);
            setCustomDropDownData(false);
            refetch();
          } else if (
            response?.data?.status == "ERROR" ||
            response?.data?.status == "FAIL"
          ) {
            setLoading(false);
            toast.error(response?.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error?.message);
          setLoading(false);
        }
      }
    }
  };

  // function for modal close if click on outside the modal
  useEffect(() => {
    if (showModal) {
      const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          setShowModal(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick, {
        capture: true,
      });
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [showModal]);

  // function for Edited Data
  const submitEditedForm = async () => {
    try {
      setLoading(true);
      let body = {
        // machineId: formData.machineId,
        description: clientformData?.description,
        created_by: clientformData?.Machinery_created_id,
        id_order: clientformData?.orderId,
        date: moment(clientformData?.date).format("YYYY-MM-DD"),
        id_state: status?.id_state,
        inspections: [
          {
            id_machinery_type: formData.machineId,
            id_ispector:
              typeof formData?.inspectorId === "object" &&
              formData?.inspectorId !== null
                ? formData?.inspectorId?.inspectorId
                : formData?.inspectorId,
            notes: formData?.notes,
            id_inspection: formData?.inspectionId,
            id_working_area: formData?.areaId || null,
            year: parseInt(formData?.year) || null,
            atex: formData?.atex || false,
            ce: formData?.ce || false,
          },
        ],
        newMachine: 0,
      };

      let newBody = {
        description: clientformData?.description,
        created_by: clientformData?.Machinery_created_id,
        id_order: clientformData?.orderId,
        date: moment(clientformData?.date).format("YYYY-MM-DD"),
        id_state: status?.id_state,
        inspections: [
          {
            // id_machinery_type: formData?.machineName?.label,
            id_machinery_type: null,
            id_ispector: formData?.inspectorId.inspectorId,
            notes: formData?.notes,
            id_working_area: formData?.areaId || null,

            newMachine: {
              name: formData?.name,
              brand_name: MachineryID,
              typology: topologyName,
              year: parseInt(formData?.year) || null,
              norm_specification: formData?.norm_specification,
              atex: formData?.atex || false,
              ce: formData?.ce || false,
            },
          },
        ],
        newMachine: 1,
      };

      const response = await updateInspection({
        url: filterApi?.updateInspectionUrl,
        method: filterApi?.updateInspectionMethod,
        params: upDateOrderId,
        body: customDropDownData ? newBody : body,
      });

      if (response?.data?.status == "SUCCESS") {
        toast.success(response?.data?.message);
        setLoading(false);
        setShowNextForm(false);
        setFormData({
          topologyDefaultValues: "",
          normedefaultValue: "",
          defaultValue: "",
          brand_name: "",
          typology: "",
          inspectorId: "",
          machineId: "",
          atex: "",
          ce: "",
          inspectorId: "",
          norm_specification: [],
          year: "",
          areaId: "",
          inspectionId: "",
          norm: "",
          arealavoe_defaultvalue: "",
          notes: "",
          normeDellData: [],
          MachineryData: [],
        });
        setData(null);
        setNormeOptions([]);
        setMachineryID(null);
        setTopologyName(null);
        setNormeOptions([]);
        seteditId(null);
        setCustomDropDownData(false);
        setshowButton(null);
        setCustomDropDownData(false);
        refetch();
      } else if (
        response?.data?.status == "ERROR" ||
        response?.data?.status == "FAIL"
      ) {
        setLoading(false);
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  //function download excel file
  const exportToExcel = () => {
    const fileName = "Planned_inspection_items";
    const headers = [
      "Nome del marchio",
      "Macchinario",
      "Tipologia Macchinario",
      "Ispettore",
      "Area Lavoro",
      "Anno costruzione",
      "Notes",
      "Norme",
      "CE",
      "ATEX",
      "Data Ispezione",
    ];

    const excelData = showFormData?.data?.inspections?.length
      ? showFormData?.data?.inspections?.map((item) => {
          return [
            item?.machinery_info?.brand_name || null,
            item?.machinery_info?.name || null,
            item?.machinery_info?.typology || null,
            item?.ispector_info?.name || null,
            item?.working_area_info?.wa_name || null,
            item?.machinery_info?.year || null,
            item?.notes || null,
            item?.machinery_info?.norm_specification
              ?.map((spec) => spec.name)
              .join(", ") || null,
            item?.machinery_info?.ce || false,
            item?.machinery_info?.atex || false,
            item?.calendar_info?.date || null,
          ];
        })
      : [];

    const dataWithHeaders = [headers, ...excelData];
    const ws = XLSX.utils.aoa_to_sheet(dataWithHeaders);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  };

  const transformData = (rawData) => {
    const headers = rawData[0];
    // first row as headers
    const rows = rawData.slice(1);
    // remaining rows as data

    return rows.map((row) => {
      return headers.reduce((acc, header, index) => {
        acc[header] = row[index];
        return acc;
      }, {});
    });
  };
  const openExcelImportPopup = () => {
    setIsExcelPopupOpen(true);
  };

  const closeExcelImportPopup = () => {
    setIsExcelPopupOpen(false);
  };
  const [uploadExcel] = useUploadExcelMutation();

  const handleExcelImportButton = async (file) => {
    try {
      const formData = new FormData();
      formData.append("id_order", clientformData?.orderId);
      formData.append("description", clientformData?.description);
      formData.append("created_by", clientformData?.Machinery_created_id);
      formData.append("id_state", status?.id_state);
      formData.append("file", file);
      const response = await uploadExcel({
        url: filterApi?.importExcelApi,
        method: filterApi?.importExcelApiMethod,
        body: formData,
      }).unwrap();

      if (response?.status === "SUCCESS") {
        toast.success(response?.message);
        refetch();
      } else if (response.status === "ERROR" || response.status === "FAIL") {
        toast.error(response?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
    setIsExcelPopupOpen(false);
  };

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
      {(isFetching || editedDataFetching || loading) && <Loader />}
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
                {findAreaByKeyPrefix("FormArea8", areas, { showModal }) || (
                  <div>- -</div>
                )}
              </div>
              <div className="ispezione-detaBox">
                {findAreaByKeyPrefix("EditArea2", areas, { handleSubmit }) || (
                  <div>- -</div>
                )}
              </div>
              {findAreaByKeyPrefix("EditArea3", areas, {
                stateListing,
                status,
                setStatus,
              }) || <div>- -</div>}
            </div>
            {findAreaByKeyPrefix("EditArea4", areas, {
              handleSubmit,
              showNextForm,
            }) || <div>- -</div>}

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
                    formValues: clientformData?.created_by,
                    formName: { name: "created_by" },
                  }) || <div>- -</div>}
                  {findAreaByKeyPrefix("EditArea7", areas, {
                    clientformData,
                    isSelectActive,
                    handleDateChange,
                    errorsForm1,
                  }) || <div>- -</div>}
                </div>
              </form>
              <div className="col-md-12">
                <div className="form-btn-sets">
                  <div className="btn-set-left">
                    {findAreaByKeyPrefix("EditButtonArea0", areas, {
                      handleClientSubmit,
                      addButttonApi,
                      handleSubmit,
                    }) || <div>- -</div>}
                    {showNextForm && showButton == "add"
                      ? findAreaByKeyPrefix("EditButtonArea1", areas, {
                          handleSubmit,
                        }) || <div>- -</div>
                      : showButton == "edit"
                      ? findAreaByKeyPrefix("EditButtonArea4", areas, {
                          submitEditedForm,
                        }) || <div>- -</div>
                      : ""}
                  </div>
                  <div className="btn-set-right">
                    {findAreaByKeyPrefix("EditButtonArea2", areas, {
                      openExcelImportPopup,
                    }) || <div>- -</div>}
                    {findAreaByKeyPrefix("EditButtonArea3", areas, {
                      exportToExcel,
                    }) || <div>- -</div>}
                  </div>
                </div>
              </div>
              {showNextForm && (
                <div className="new-added">
                  {findAreaByKeyPrefix("EditArea9", areas) || <div>- -</div>}
                  {findAreaByKeyPrefix("BodyArea", areas, { handleClose }) || (
                    <div>- -</div>
                  )}
                  <div className="row row-gap">
                    {findAreaByKeyPrefix("EditArea13", areas, {
                      machineTypology,
                      handleSelectMachineryTopology,
                      formData,
                      errors,
                      topologyName,
                    }) || <div>- -</div>}
                    {findAreaByKeyPrefix("EditArea14", areas, {
                      MachineryData: formData?.MachineryData,
                      formData,
                      handleSelectChange,
                      errors,
                      MachineryID,
                    }) || <div>- -</div>}
                    {findAreaByKeyPrefix("EditArea10", areas, {
                      normeDellData: formData?.normeDellData,
                      handleSelectMachinery,
                      formData,
                      errors,
                    }) || <div>- -</div>}
                    {findAreaByKeyPrefix("EditArea15", areas, {
                      formValues: formData.year,
                      formName: { name: "year", type: "number" },
                      handleNotes: handleYear,
                      formData,
                    }) || <div>- -</div>}

                    {findAreaByKeyPrefix("EditArea17", {
                      formData,
                      handleSelectNormeListing,
                      normeListing,
                      normeOptions,
                      setNormeOptions,
                      customDropDownData,
                    }) || <div>- -</div>}
                    <div className="col-md-4">
                      <div className="form-custom-check inline-check ccmt-50">
                        {findAreaByKeyPrefix("EditCheckArea1", areas, {
                          formValues: formData,
                          handleChange: handleChangeeditCheckBox1,
                        }) || <div>- -</div>}
                        {findAreaByKeyPrefix("EditCheckArea2", areas, {
                          formValues: formData,
                          handleChange: handleChangeeditCheckBox2,
                        }) || <div>- -</div>}
                      </div>
                    </div>
                    {findAreaByKeyPrefix("EditArea12", areas, {
                      handleSelectArea,
                      formData,
                      workingListing,
                      errors,
                    }) || <div>- -</div>}
                    {findAreaByKeyPrefix("EditArea11", areas, {
                      formData,
                      formValues: formData?.inspectorId?.inspectorId,
                      ispectorListing,
                      handleSelectIspector,
                      errors,
                    }) || <div>- -</div>}
                    {findAreaByKeyPrefix("EditArea16", areas, {
                      formData,
                      formValues: formData.notes,
                      handleNotes,
                      formName: { name: "notes", type: "text" },
                    }) || <div>- -</div>}
                  </div>
                </div>
              )}
              {findAreaByKeyPrefix("EditTableArea", areas, {
                rzOrderdetails,
                deleteInspection,
                showModal,
                setShowModal,
                handleModal,
                handleFormPage,
                showFormData,
                modalRef,
              }) || <div>- -</div>}
            </div>

            <ExcelImport
              isOpen={isExcelPopupOpen}
              onClose={closeExcelImportPopup}
              handleExcelImportSubmit={handleExcelImportButton}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout6;

function ExcelImport({ isOpen, onClose, handleExcelImportSubmit }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
    }
  };
  useEffect(() => {
    if (isOpen) {
      setError("");
      setFile(null);
    }
  }, [isOpen]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a Excel File");
      return;
    }
    handleExcelImportSubmit(file);
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upload Excel File</Modal.Title>
      </Modal.Header>
      <form onSubmit={handleSubmit}>
        <Modal.Body>
          <input
            type="file"
            accept=".xlsx,.xls"
            className={`form-control ${error ? "is-invalid" : ""}`}
            onChange={handleFileChange}
          />
          {error && <div className="invalid-feedback">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" type="submit">
            Upload
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
