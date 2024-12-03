import React, { useState, useEffect } from "react";
import moment from 'moment';
import { useCreateInspectionMutation, useDeleInspectionMutation, useGetAddDropDownListQuery, useGetEditIDOrderQuery, useGetMachineryIDOrderQuery, useGetRzOrderQuery, useUpdateInspectionMutation } from "../../services/apiSlice";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { useMemo } from "react";

const MainLayout6 = ({ areas }) => {

    const id_order = localStorage.getItem("id_order");

   // const editIdIspenzio = localStorage.getItem("ispenzioEditID");
    
    const [MachineryID, setMachineryID] = useState(null);
    const [topologyName, setTopologyName] = useState(null);
    const [showNextForm, setShowNextForm] = useState(false);


    const [status, setStatus] = useState({ id_state: 2, state: "Pianificata" });
    const [isSelectActive, setIsSelectActive] = useState(false);

    const [editShowFormData, setEditShowFormData] = useState({});

    const [errors, setErrors] = useState({});
    const [errorsForm1, setErrorsForm1] = useState({});

    const [showModal, setShowModal] = useState();
    const [editId, seteditId] = useState();
    const [upDateOrderId, setupDateOrderId] = useState(null);
    const [deletedInspectionId, setDeletedInspectionId] = useState(null);
    const [showButton, setshowButton] = useState(null)




    const [clientformData, setClientformData] = useState({
        description: "",
        created_by: "",
        client: "",
        orderId: "",
        date: null,
    });


    const [formData, setFormData] = useState(
        {
            machineId: "",
            inspectorId: {},
            areaId: "",
            year: "",
            defaultValue: "",
            notes: "",
            normeId: "",
            ce: false,
            atex: false,
        }
    );

    const validateForm = () => {
        let isValid = true;
        let validationErrors = {};
        formData.forEach((item, index) => {
            let itemErrors = {};
            if (!item.machineId) {
                itemErrors.machineId = "Macchinario is required";
                isValid = false;
            }

            if (Object.keys(itemErrors).length > 0) {
                validationErrors[index] = itemErrors;
            }
        });

        setErrors(validationErrors);
        return isValid;
    };

    const validateClientForm = () => {
        const newErrors = {};
        let isValid = true;

        // if (!clientformData.date && !data?.data?.inspections[0]?.calendar_info?.date) {
        if (!clientformData.date) {
            newErrors.date = "Date is required";
            isValid = false;
        }

        setErrorsForm1(newErrors);
        return isValid;
    };





    const findAreaByKeyPrefix = (prefix, extraProps = {}) => {
        const area = areas.find(area => area.key && area.key.startsWith(prefix));
        if (area) {
            // Function to recursively clone elements and add extra props
            const deepCloneChildren = (children, extraProps) => {
                return React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        // Clone child and pass down extraProps
                        const clonedChild = React.cloneElement(child, { ...extraProps });

                        // If the child has its own children, recurse through them
                        if (child.props && child.props.children) {
                            const updatedChildren = deepCloneChildren(child.props.children, extraProps);
                            return React.cloneElement(clonedChild, { children: updatedChildren });
                        }

                        return clonedChild;
                    }

                    return child;
                });
            };

            // Clone the area element itself and its nested children
            const clonedArea = React.cloneElement(area, {
                ...extraProps,
                children: deepCloneChildren(area.props.children, extraProps),
            });
            return clonedArea;
        }

        return null;
    };


    const filterApi = areas.filter(
        (item) => item?.props?.children?.props?.children?.props?.api != null)
        .reduce((acc, user) => {
            const function_name = user?.props?.children?.props?.children?.props?.api?.function_name;
            const apiMethod = user?.props?.children?.props?.children?.props?.api?.method_type;

            if (function_name.includes("getDropdownList")) {
                acc.getDropDownUrl = function_name;
                acc.getDropdownMethod = apiMethod;
            }
            if (function_name.includes("/api/v1/inspections/rz-order")) {
                acc.getRzOrderUrl = function_name;
                acc.getRzOrderMethod = apiMethod
            }
            if (function_name.includes("/machinery/get-machinery")) {
                acc.getMachineryUrl = function_name;
                acc.getMachineryMethod = apiMethod;
            }
            if (function_name.includes("filter-machinery")) {
                acc.MachineryFilter = function_name;
            }
            if (function_name.includes("brand_name")) {
                acc.MachineryFilterBrandName = function_name;
            }
            if (function_name.includes("create-inspections")) {
                acc.createInspectionUrl = function_name;
                acc.CreateInspectionMethod = apiMethod;
            }
            if (function_name.includes("inspections/update-inspection")) {
                acc.updateInspectionUrl = function_name;
                acc.updateInspectionMethod = apiMethod;
            }


            return acc;
        }, {})

    // api for Delete inspection 
    const apiData = areas?.find(
        (item) => item?.props?.children?.props?.children?.[0]?.props?.areas?.element_type === "table"
    );

    // console.log("apiData", apiData);


    const getDeleteApi = apiData?.props?.children?.props?.children?.[0]?.props?.nestedElements?.reduce((acc, data) => {
        const function_name = data?.props?.children?.props?.children?.props?.api?.function_name;


        const methodType = data?.props?.children?.props?.children?.props?.api?.method_type;

        if (function_name?.includes("inspection-delete")) {
            acc.deleteApiURL = function_name;
            acc.deleteApiMethod = methodType;
        }
        if (function_name?.includes("/get-inspection?id_inspection=")) {
            acc.EditGetApiURL = function_name;
        }
        return acc;
    }, {});
    // console.log("getData",getDeleteApi);







    // api calls 
    const { data: dropdownList, refetch: refetchDropDown } = useGetAddDropDownListQuery(filterApi.getDropDownUrl);
    const { data: rzOrderdetails, refetch } = useGetRzOrderQuery({
        url: filterApi.getRzOrderUrl,
        params: id_order,
        refetchOnMountOrArgChange: true,
    });

    console.log("rzOrderdetails",rzOrderdetails);

    const { data } = useGetEditIDOrderQuery({
        // url:editId? filterApi.EditInspectionUrl:"",
        url: editId ? "/api/v1/inspections/get-inspection?id_inspection=" : "",

        params: editId,


    })


    // console.log(data,"editdata")



    // api delete inspection
    const [deleInspection] = useDeleInspectionMutation()

    /// api for create Inspecton
    const [createInspection] = useCreateInspectionMutation();

    // api for uddate inspection 
    const [updateInspection] = useUpdateInspectionMutation();

    const ispectorListing = dropdownList?.data?.ispectorListing;

    //  const machineListing = dropdownList?.data?.machineListing;
    //  const machineBrand = dropdownList?.data?.machineBrand;
    const machineTypology = dropdownList?.data?.machineTypology;

    //  const normeListing = dropdownList?.data?.normeListing;
    const stateListing = dropdownList?.data?.stateListing;
    const workingListing = dropdownList?.data?.workingListing;



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
    }, [rzOrderdetails]);

    const handleSelectIspector = (selectedOption) => {
        if (selectedOption) {
            setFormData({
                ...formData,
                inspectorId: selectedOption
            })
        }
    }

    const handleClientSubmit = (e) => {

        e.preventDefault();
        setEditShowFormData({})
        setshowButton("add");
        if (validateClientForm()) {
            setShowNextForm(true)
            //   setSectionAdded(true);
        }
    };



    //selected change 2 input
    const handleSelectChange = (selectedOption) => {
        if (selectedOption) {
            setMachineryID(selectedOption?.value);
        }
    }

    const handleSelectMachineryTopology = (selectedOption) => {
        if (selectedOption) {
            setTopologyName(selectedOption.value);
        }
    };


    const handleSelectArea = (selectedOption) => {
        if (selectedOption) {
            setFormData({
                ...formData,
                areaId: selectedOption?.areaId
            });
        }
    }

    // function for handleNotes
    const handleNotes = (e) => {
        setFormData({
            ...formData,
            notes: e.target.value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (validateForm()){
        try {
            let body = {
                // machineId: formData.machineId,
                description: clientformData?.description,
                created_by: clientformData?.Machinery_created_id,
                id_order: clientformData?.orderId,
                date: moment(clientformData?.date).format("YYYY-MM-DD"),
                id_state: status?.id_state,
                inspections: [{
                    machineId: formData.machineId,
                    inspectorId: formData?.inspectorId.inspectorId,
                    notes: formData?.notes,
                    areaId: formData?.areaId,
                }]
            }
            const response = await createInspection({
                url: filterApi?.createInspectionUrl,
                method: filterApi.CreateInspectionMethod,
                body: body,
            })
            if (response?.data?.status == "SUCCESS") {
                toast.success(response?.data?.message)
                setFormData({
                    machineId: "",
                    inspectorId: {},
                    areaId: "",
                    year: "",
                    notes: "",
                    normeId: "",
                    ce: false,
                    atex: false,
                });
                window.location.reload();
                // refetchDropDown();
                // refetch();
                showNextForm(false);
                setMachineryID("");
                setTopologyName("");

            }
            else {
                toast.error(response?.data?.message);
            }

        }


        catch (error) {
            console.log(error);
        }

    }


    // function for delete Modal 
    const handleModal = (id) => {
        console.log("deletedId", id);
        setDeletedInspectionId(id)
        setShowModal(true);
    }

    // function for  delete inspection in add form  
    const deleteInspection = async (id) => {
        try {
            const response = await deleInspection({
                url: getDeleteApi?.deleteApiURL,
                method: getDeleteApi?.deleteApiMethod,
                id: deletedInspectionId,
            });

            if (response?.data?.status == "SUCCESS") {
                toast.success(response?.data?.message);
                setShowModal(false);
                refetch();
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            console.error("Error deleting inspection:", error);
        }
    };


    // handle Edit form In Add Inspection Form Page 
    const { data: MachineryData, isLoading, isError, refetch: machineryOrder } = useGetMachineryIDOrderQuery(
        topologyName ? { url: filterApi.MachineryFilter, params: topologyName } : null
    );
    //   const query=useQu


    const handleFormPage = (item, index) => {
        setShowNextForm(true);
        setshowButton("edit");
        setFormData([])
        seteditId(item?.id_inspection)
        setupDateOrderId(item?.id_order)
        setMachineryID(item?.machinery_info?.brand_name)
        setTopologyName(item?.machinery_info?.typology);
    }




    const { data: normeDellData } = useGetMachineryIDOrderQuery(
        MachineryID ? { url: filterApi.MachineryFilterBrandName, params: MachineryID } : null
    );

    const handleSelectMachinery = (selectedoption) => {
        if (selectedoption) {
            const filterMachineryIdData = normeDellData?.data?.find((item) => item?.name == selectedoption?.value);
            console.log("filterMachineryIdData", filterMachineryIdData)
            setFormData({
                inspectorId: { label: filterMachineryIdData?.name },
                year: filterMachineryIdData?.year,
                normeId: filterMachineryIdData?.norm_specification,
                ce: filterMachineryIdData?.ce,
                atex: filterMachineryIdData?.atex,
                machineId: selectedoption.id_machinery_type
            })
            // console.log("formData",filterMachineryIdData)
        }

    }







    const handleDateChange = (date) => {

        if (date) {
            // Ensure that date is a valid Date object or string.
            const formattedDate = moment(date).isValid() ? moment(date).format('MMMM D, YYYY') : null;
            if (formattedDate) {
                setClientformData({ ...clientformData, date: formattedDate });
                setIsSelectActive(true);
            } else {
                console.error("Invalid date format");
                setIsSelectActive(false);
            }
        } else {
            // If the date is null or undefined
            setIsSelectActive(false);
            setClientformData({ ...clientformData, date: null });
        }
    };


    useMemo(() => {
        if (data) {
            let datas = data?.data
            setFormData([])
            setMachineryID(datas?.brand_name)
            setTopologyName(datas?.typology);
            const machinaryInfo =
                MachineryData?.data?.find(
                    (machineData) => {
                        console.log("machineId", machineData?.id_machinery_type)
                        return machineData?.id_machinery_type === datas?.id_machinery_type
                    }
                ) || {};

            console.log("machinaryInfo", datas);

            const newdata = {
                topologyDefaultValues: { value: datas?.typology, lable: datas?.typology },
                normedefaultValue: { value: datas?.machine_name, label: datas?.machine_name },
                defaultValue: { value: datas.brand_name, label: datas.brand_name },
                brand_name: datas.brand_name,
                inspectorId: datas.id_ispector,
                machineId: datas?.id_machinery_type,
                atex: datas?.atex,
                ce: datas?.ce,
                norm_specification: machinaryInfo?.norm_specification,
                year: datas?.year,
                typology: datas?.typology,
                areaId: datas?.id_working_area,
                inspectionId: datas?.id_inspection,
                normeId: [{ name: datas?.norms?.map((item) => item?.name) }],
                arealavoe_defaultvalue: { value: datas?.wa_name, label: datas?.wa_name },
                notes: datas?.notes
            };
            setStatus({ status: datas?.order_state, id_state: datas?.id_state });
            handleSelectMachinery({ value: datas?.machine_name, label: datas?.machine_name })
            setFormData(newdata);
        }
    }, [data])


    // function for Edited Data
    const submitEditedForm = async () => {
        try {

            let body = {
                // machineId: formData.machineId,
                description: clientformData?.description,
                created_by: clientformData?.Machinery_created_id,
                id_order: clientformData?.orderId,
                date: moment(clientformData?.date).format("YYYY-MM-DD"),
                id_state: status?.id_state,
                inspections: [{
                    machineId: formData.machineId,
                    inspectorId: (typeof formData?.inspectorId === "object" && formData?.inspectorId !== null)
                        ? formData?.inspectorId?.inspectorId
                        : formData?.inspectorId,
                    notes: formData?.notes,
                    inspectionId: formData?.inspectionId,
                    areaId: formData?.areaId,
                }]
            }

            const response = await updateInspection({
                url: filterApi?.updateInspectionUrl,
                method: filterApi?.updateInspectionMethod,
                params: upDateOrderId,
                body: body,
            })

            if (response?.data?.status == "SUCCESS") {
                toast.success(response?.data?.message);
                setShowNextForm(false)
                window.location.reload();
            } else if (response?.data?.status == "ERROR" || response?.data?.status == "FAIL") {
                toast.error(response?.data?.message);
            }

        } catch (error) {
            console.log("error", error);
        }

    }


    return (
        <>
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
                            strokeDashoffset: "307.919"
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
                                {findAreaByKeyPrefix('HeaderArea1') || <div>- -</div>}
                                <div className="overlay" style={{ display: "none" }} />
                                {findAreaByKeyPrefix('HeaderArea2') || <div>- -</div>}
                                {findAreaByKeyPrefix('HeaderArea3') || <div>- -</div>}
                                {findAreaByKeyPrefix('HeaderArea4') || <div>- -</div>}
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
                                {findAreaByKeyPrefix('FormArea7') || <div>- -</div>}
                                {findAreaByKeyPrefix('FormArea8') || <div>- -</div>}
                            </div>
                            <div className="ispezione-detaBox">
                                {findAreaByKeyPrefix('EditArea1') || <div>- -</div>}
                                {findAreaByKeyPrefix('EditArea2', { handleSubmit }) || <div>- -</div>}

                            </div>
                            {findAreaByKeyPrefix('EditArea3', { stateListing, status, setStatus }) || <div>- -</div>}

                        </div>
                        {findAreaByKeyPrefix('EditArea4') || <div>- -</div>}

                        <div className="form-input-block">
                            <form action="#!">
                                <div className="row row-gap">
                                    {findAreaByKeyPrefix('EditArea5', { value:clientformData?.description, label:"description" }) || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea6', { clientformData }) || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea8', { formValues: clientformData?.created_by, formName: { name: "created_by" } }) || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea7', { clientformData, isSelectActive, handleDateChange, errorsForm1 }) || <div>- -</div>}
                                </div>
                            </form>
                            <div className="col-md-12">
                                <div className="form-btn-sets">
                                    <div className="btn-set-left">
                                        {findAreaByKeyPrefix('EditButtonArea0', { handleClientSubmit }) || <div>- -</div>}
                                        {showNextForm && showButton == "add" ? (
                                            findAreaByKeyPrefix('EditButtonArea1', { handleSubmit }) || <div>- -</div>
                                        ) : showButton == "edit" ? (
                                            findAreaByKeyPrefix('EditButtonArea4', { submitEditedForm }) || <div>- -</div>
                                        ) : ""}
                                    </div>
                                    <div className="btn-set-right">
                                        {findAreaByKeyPrefix('EditButtonArea2') || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditButtonArea3') || <div>- -</div>}
                                    </div>
                                </div>
                                {/* form-btn-sets END */}
                            </div>
                            {/* Add Element */}


                            {showNextForm && (
                                <div className="new-added" >
                                    {findAreaByKeyPrefix('EditArea9') || <div>- -</div>}
                                    {findAreaByKeyPrefix('BodyArea') || <div>- -</div>}
                                    <div className="row row-gap">
                                        {findAreaByKeyPrefix('EditArea13', { machineTypology, handleSelectMachineryTopology, formData }) || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditArea14', { MachineryData, formData, handleSelectChange }) || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditArea10', { normeDellData, handleSelectMachinery, formData }) || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditArea15', { formValues: formData.year }) || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditArea17', { formData }) || <div>- -</div>}
                                        <div className="col-md-4">
                                            <div className="form-custom-check inline-check ccmt-50">
                                                {findAreaByKeyPrefix('EditCheckArea1', { formValues: formData }) || <div>- -</div>}
                                                {findAreaByKeyPrefix('EditCheckArea2', { formValues: formData }) || <div>- -</div>}
                                            </div>
                                        </div>

                                        {findAreaByKeyPrefix('EditArea12', { handleSelectArea, formData, workingListing }) || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditArea11', { formData, formValues: clientformData?.created_by, formData, ispectorListing, handleSelectIspector }) || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditArea16', { formData, formValues: formData.notes, handleNotes, formName: { name: "notes" } }) || <div>- -</div>}

                                    </div>
                                </div>
                            )}
                            {findAreaByKeyPrefix('EditTableArea', {
                                rzOrderdetails, deleteInspection,
                                showModal, setShowModal, handleModal,
                                handleFormPage
                            }) || <div>- -</div>}
                            {/* Added Elements Table END*/}
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default MainLayout6;
