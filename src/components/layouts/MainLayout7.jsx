import React, { useState, useEffect, useRef } from "react";
import moment from 'moment';
import { useCreateInspectionMutation, useDeleInspectionMutation, useGetAddDropDownListQuery, useGetEditIDOrderQuery, useGetMachineryIDOrderQuery, useGetRzOrderQuery, useUpdateInspectionMutation } from "../../services/apiSlice";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { useMemo } from "react";
import * as XLSX from "xlsx";
import { useLocation } from "react-router-dom";
import Loader from "../../lib/loader/loader";

const MainLayout6 = ({ areas }) => {
    const location = useLocation();
    const route = location.pathname.substring(1) || '/';

    const userId = localStorage.getItem("user_id");
    const modalRef = useRef(null);
    const [file,setFile]= useState(null)

    

    // id for add Ispenzio Mainlayout Table Add  
    const id_order = localStorage.getItem("id_order");
    const AddRoute = localStorage.getItem("addRoute");
    const [customDropDownData,setCustomDropDownData] = useState(false);
    const [isExcelPopupOpen, setIsExcelPopupOpen] = useState(false);
  
    

    // id for Edit ispenzio MainLayout Table edit 
    const editIdIspenzio = localStorage.getItem("ispenzioEditID");
    const editroute = localStorage.getItem("editroute");

    // console.log("editIdIspenzio",editIdIspenzio);
    
    const [MachineryID, setMachineryID] = useState(null);
    const [topologyName, setTopologyName] = useState(null);
    const [showNextForm, setShowNextForm] = useState(false);
    const [addButttonApi,setAddButtonApi] = useState(false);
    const [normeOptions, setNormeOptions] = useState([]);
    const [showFormData, setshowFormData] = useState([]);


    const [status, setStatus] = useState({ id_state: 2, state: "Pianificata" });
    const [isSelectActive, setIsSelectActive] = useState(false);

    const [editShowFormData, setEditShowFormData] = useState({});

    const [errors, setErrors] = useState({});
    const [errorsForm1, setErrorsForm1] = useState({});

    const [showModal, setShowModal] = useState(false);
    const [editId, seteditId] = useState(null);
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
            norm_specification: [],
            ce: false,
            atex: false,
        }
    );

    const validateForm = () => {
        let isValid = true;
        let validationErrors = {};
    
        // Check each individual field of formData
        // if (!formData.machineId) {
        //     validationErrors.machineId = "Macchinario is required";
        //     isValid = false;
        // }
    
        // if (!formData.inspectorId) {
        //     validationErrors.inspectorId = "Inspector Name is required";
        //     isValid = false;
        // }
    
        if (!formData.areaId) {
            validationErrors.areaId = "Area Name is required";
            isValid = false;
        }
        // if (!MachineryID) {
        //     validationErrors.brand_name = "Norme Dell Name is required";
        //     isValid = false;
        // }
        if (!topologyName) {
            validationErrors.topology = "Machinrio is required";
            isValid = false;
        }
        
        // if (!formData.norm) {
        //     validationErrors.norm = "Norm is required";
        //     isValid = false;
        // }
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
        const area = areas?.find(area => area.key && area.key.startsWith(prefix));
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


    

    const filterApi = areas?.filter(
        (item) => item?.props?.children?.props?.children?.props?.api != null)
        .reduce((acc, user) => {
            const key = user?.key;
            const function_name = user?.props?.children?.props?.children?.props?.api?.function_name;
            const apiMethod = user?.props?.children?.props?.children?.props?.api?.method_type;

            if (key.includes("EditArea3")) {
                acc.getDropDownUrl = function_name;
                acc.getDropdownMethod = apiMethod;
            }
            if (key.includes("FormArea8")) {
                acc.getRzOrderUrl = function_name;
                acc.getRzOrderMethod = apiMethod
            }
            // if (function_name.includes("/machinery/get-machinery")) {
            //     acc.getMachineryUrl = function_name;
            //     acc.getMachineryMethod = apiMethod;
            // }
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

            return acc;
        }, {})
       

        
    // api for Delete inspection 
    const apiData = areas?.find(
        (item) => item?.props?.children?.props?.children?.[0]?.props?.areas?.element_type === "table"
    );

    const getDeleteApi = apiData?.props?.children?.props?.children?.[0]?.props?.nestedElements?.reduce((acc, data) => {
        const function_name = data?.props?.children?.props?.children?.props?.api?.function_name;
        const methodType = data?.props?.children?.props?.children?.props?.api?.method_type;
        
        // if (function_name?.includes("inspection-delete")) {
        //     acc.deleteApiURL = function_name;
        //     acc.deleteApiMethod = methodType;
        // }
        if(function_name && acc === undefined){
            return { deleteUrl :function_name,deleteMethod : methodType}
          }
      
        return acc;
    }, undefined);


    // api calls 
    const { data: dropdownList, refetch: refetchDropDown } = useGetAddDropDownListQuery(filterApi?.getDropDownUrl);
    const { data: rzOrderdetails, refetch,isFetching } = useGetRzOrderQuery({
        url: filterApi?.getRzOrderUrl,
        params: (() => {
            if (route === AddRoute) return id_order;
            if (route === editroute) return editIdIspenzio;
            return id_order;
        })(),
        refetchOnMountOrArgChange: true,
    });
    


    // function for Edit Api 
    const EditData = areas?.find(
        (item) => item?.props?.children?.props?.children?.[0]?.props?.areas?.element_type === "table"
    );
    

    const editApi = EditData?.props?.children?.props?.children?.[0]?.props?.areas?.table_columns?.reduce((acc, data) => {
        const function_name = data?.table_fields?.function?.function_name;
        if (function_name && acc === undefined) {
            return function_name;  
        }
        return acc;  
    }, undefined);  


 
    
    

    const { data } = useGetEditIDOrderQuery(
        editId ? { url: editApi, params: editId } : null
    );

    // const { data } = useGetEditIDOrderQuery({
    //     // url:editId? filterApi.EditInspectionUrl:"",
    //     url: editId ? "/api/v1/inspections/get-inspection?id_inspection=" : "",
    //     params: editId,

    // })


    // api delete inspection
    const [deleInspection] = useDeleInspectionMutation()

    /// api for create Inspecton
    const [createInspection] = useCreateInspectionMutation();

    // api for update inspection 
    const [updateInspection] = useUpdateInspectionMutation();
    
    //data for inspection listing 
    const ispectorListing = dropdownList?.data?.ispectorListing;

    // data machineTopology getting for dropdownList api 
    const machineTypology = dropdownList?.data?.machineTypology;

    // data for state Listing for getting from dropdownList api
    const stateListing = dropdownList?.data?.stateListing;

    // data for working area listing getting from dropdown listing 
    const workingListing = dropdownList?.data?.workingListing;
    
    const machineListing =dropdownList?.data?.machineListing;
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

        const inspectorData = ispectorListing?.find((item)=>item?.id_user == userId);
        setFormData({
            ...formData,
            inspector_name:inspectorData?.name,
            inspectorId : {inspectorId :inspectorData?.id_ispector}, 
        })

        setshowFormData(rzOrderdetails)
       
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
        console.log("showButton",showButton)
        e.preventDefault();
        setEditShowFormData({})
        if(showButton == "edit"){
            return
           }
        setshowButton("add");
        if (validateClientForm()) {
            setShowNextForm(true)
            setAddButtonApi(true);
            //   setSectionAdded(true);
        } 
    };

    //selected change 2 input
    const handleSelectChange = (selectedOption) => {
     
        if(selectedOption?.__isNew__){
            setCustomDropDownData(true);
            setMachineryID (selectedOption.value);
        }
        if (!selectedOption?.__isNew__) {
            setMachineryID(selectedOption?.value);
        }
    }

    const handleSelectMachineryTopology = (selectedOption) => {
       
        if(selectedOption?.__isNew__){
            setCustomDropDownData(true);
            setTopologyName(selectedOption.value);
        }
        if (!selectedOption?.__isNew__) {
            setTopologyName(selectedOption.value);
        }
    };


    const handleSelectNormeListing = (selectedOption) => {
            
            setCustomDropDownData(true);
            // setNormeOptions(selectedOption?.map((item) => ({
            //     label: item.label,  
            //     value: item.value,
            //   })) || [])

            setNormeOptions(selectedOption);
                
      
            setFormData((prevData) => ({
                ...prevData,
                norm_specification: selectedOption?.map((item)=>item.value),
            }))
        
        
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


    // function for delete Modal 
    const handleModal = (id) => {
       
        setDeletedInspectionId(id)
        setShowModal(true);
    }


    // function for close Form 
    const handleClose = () => {
        setFormData({
          ...formData,
          topologyDefaultValues: "",
          normedefaultValue: "",
          defaultValue: "",
          brand_name: "",
        //   inspectorId: "",
        //   inspector_name: "",
          machineId: "",
          atex: "",
          ce: "",
          norm_specification: "",
          year: "",
          areaId: "",
          inspectionId: "",
          norm: "",
          topology:"",
          arealavoe_defaultvalue: "",
          notes: ""
        });
        setMachineryID(null);
        setTopologyName(null);
        setShowNextForm(false);
        setAddButtonApi(false);
        setshowButton(null)
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


    // handle Edit form In Add Inspection Form Page 
    const { data: MachineryData, isLoading, isError, refetch: machineryOrder } = useGetMachineryIDOrderQuery(
        topologyName ? { url: filterApi.MachineryFilter, params: topologyName } : null
    );
     
    useMemo(()=>{
        if(MachineryData){
            setFormData({...formData,MachineryData:MachineryData})
        }
    },[MachineryData])


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


    useMemo(()=>{
        if(normeDellData){
            setFormData({...formData,normeDellData:normeDellData})
        }
    },[normeDellData])
    
    const handleSelectMachinery = (selectedoption) => {
      
        if(selectedoption?.__isNew__){
            // setFormData({
            //     ...formData,
            //     ce:"",
            //     atex:"",
            //     year : "",
            // })
            setCustomDropDownData(true);
                setFormData({
                  ...formData,
                  machineName: selectedoption,
                  name: selectedoption.label
                });
           
        }
        if (!selectedoption?.__isNew__) {
            const filterMachineryIdData = normeDellData?.data?.find((item) => item?.name == selectedoption?.value);
            // console.log("filterMachineryIdData", filterMachineryIdData)
            setFormData({
                ...formData,
                // inspectorId: { label: filterMachineryIdData?.name },
                year: filterMachineryIdData?.year ?? null,
                norm: filterMachineryIdData?.norm_specification ?? null ,
                ce: filterMachineryIdData?.ce ?? null,
                atex: filterMachineryIdData?.atex ?? null,
                machineId: selectedoption.id_machinery_type
            })
            // console.log("formData",filterMachineryIdData)
        }

    }

    // handleChange function for CheckBoX 1 
    const handleChangeeditCheckBox1 = (e) => {
            setFormData((prev) => {
                return {
                    ...prev,
                    ce: e.target.checked
                };
            });
        
    }

     // handleChange function for CheckBoX 2
    const handleChangeeditCheckBox2 = (e)=>{
        setFormData((prev) => {
            return {
                ...prev,
                atex: e.target.checked
            };
        });
    }

     // handleChange function for Year 

     const handleYear = (e)=>{
        setFormData((prev)=>{
            return{
                ...prev,
                year: e.target.value
            }
        })

     }
    

    // function for DateChange Function
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
            // setFormData([])
            setMachineryID(datas?.brand_name)
            setTopologyName(datas?.typology);
            const machinaryInfo =
                formData?.MachineryData?.data?.find(
                    (machineData) => {
                      
                        return machineData?.id_machinery_type === datas?.id_machinery_type
                    }
                ) || {};

           
            const newdata = {
                topologyDefaultValues: { value: datas?.typology, lable: datas?.typology },
                normedefaultValue: { value: datas?.machine_name, label: datas?.machine_name },
                defaultValue: { value: datas.brand_name, label: datas.brand_name },
                brand_name: datas.brand_name,
                inspectorId: {inspectorId : datas.id_ispector},
                machineId: datas?.id_machinery_type,
                atex: datas?.atex,
                ce: datas?.ce,
                inspector_name : datas?.ispector_name,
                norm_specification: machinaryInfo?.norm_specification,
                year: datas?.year,
                typology: datas?.typology,
                areaId: datas?.id_working_area,
                // normId : [{ name: datas?.norms?.map((item) => item?.name) }],
                inspectionId: datas?.id_inspection,
                norm:[{ name: datas?.norms?.map((item) => item?.name) }],
                
                arealavoe_defaultvalue: { value: datas?.wa_name, label: datas?.wa_name },
                notes: datas?.notes
            };

            setStatus({ status: datas?.order_state, id_state: datas?.id_state });
            handleSelectMachinery({ value: datas?.machine_name, label: datas?.machine_name })
            setFormData(newdata);
            
        }
    }, [data])

  
    // function for Submit Form 
    const handleSubmit = async (e) => {
        e.preventDefault();

        
        if (!validateForm() && showButton == "add") {
            return;
        }

        try {

            let body = {
                // machineId: formData.machineId,
                description: clientformData?.description || null,
                created_by: clientformData?.Machinery_created_id || null,
                id_order: clientformData?.orderId || null,
                date: moment(clientformData?.date).format("YYYY-MM-DD") || null,
                id_state: status?.id_state,
                inspections: [{
                    machineId: formData.machineId || null,
                    inspectorId: formData?.inspectorId.inspectorId || null,
                    notes: formData?.notes || null,
                    areaId: formData?.areaId || null,
                }]
            }

            let newBody ={
                    description: clientformData?.description,
                    created_by: clientformData?.Machinery_created_id,
                    id_order: clientformData?.orderId,
                    date: moment(clientformData?.date).format("YYYY-MM-DD"),
                    id_state: status?.id_state,
                    inspections: [
                        {
                          machineId: formData?.machineName?.label,
                          inspectorId: formData?.inspectorId.inspectorId,
                          notes: formData?.notes,
                          areaId: formData?.areaId,
                        
                          newMachine :{
                          name: formData?.name || null,
                          brand_name: MachineryID || null,
                          typology: topologyName,
                          year: formData?.year || null,
                          norm_specification:formData?.norm_specification,
                          atex: formData?.atex || false,
                          ce: formData?.ce || false,
                        //   notes: formData?.notes
                        }
                        }
                      ],              
                    newMachine:1
            }

         
            if(showButton == "add" || showButton =="excel"){
                const response = await createInspection({
                    url: filterApi?.createInspectionUrl,
                    method: filterApi.CreateInspectionMethod,
                     body: customDropDownData ? newBody : body,
                    //body:body,
                })
                if (response?.data?.status == "SUCCESS") {
                    toast.success(response?.data?.message)
                    setFormData({
                        topologyDefaultValues: "",
                        normedefaultValue: "",
                        defaultValue: "",
                        brand_name: "",
                        typology:"",
                        inspectorId: "",
                        machineId: "",
                        atex: "",
                        ce: "",
                        inspectorId: "",
                        // inspector_name: "",
                        // inspector_name: "",
                        // norm_specification: "",
                        norm_specification :[],
                        year: "",
                        areaId: "",
                        inspectionId: "",
                        norm: "",
                        arealavoe_defaultvalue: "",
                        notes: "",
                        normeDellData:[],
                        MachineryData:[]
                      });
                     setNormeOptions([])
    
                    // window.location.reload();
                    // refetchDropDown();
                     refetch();
                    // setShowNextForm(false);
                    setMachineryID(null);
                    setTopologyName(null);
                    setNormeOptions([])
                    setCustomDropDownData(false);
    
                }
                else {
                    toast.error(response?.data?.message);
                }
               }
          
        }
        catch (error) {
            console.log(error);
        }

    }
   
   

    
    // function for modal close if click on outside the modal
    useEffect(() => {
        if (showModal) {
          const handleOutsideClick = (e) => {
             
            if (modalRef.current && !modalRef.current.contains(e.target)) {
               
              setShowModal(false); 
            }
          };
          document.addEventListener("mousedown", handleOutsideClick, { capture: true });
          return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
          };
        }
      }, [showModal]);

     
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

            let newBody ={
                description: clientformData?.description,
                created_by: clientformData?.Machinery_created_id,
                id_order: clientformData?.orderId,
                date: moment(clientformData?.date).format("YYYY-MM-DD"),
                id_state: status?.id_state,
                inspections: [
                    {
                      machineId: formData?.machineName?.label,
                      inspectorId: formData?.inspectorId.inspectorId,
                      notes: formData?.notes,
                      areaId: formData?.areaId,
                    
                      newMachine :{
                      name: formData?.name,
                      brand_name: MachineryID,
                      typology: topologyName,
                      year: formData?.year || null,
                      norm_specification:formData?.norm_specification,
                      atex: formData?.atex || false,
                      ce: formData?.ce || false,
                    //   notes: formData?.notes
                    }
                    }
                  ],              
                newMachine:1
        }

            const response = await updateInspection({
                url: filterApi?.updateInspectionUrl,
                method: filterApi?.updateInspectionMethod,
                params: upDateOrderId,
                body: customDropDownData ? newBody : body,
            })

            if (response?.data?.status == "SUCCESS") {
                toast.success(response?.data?.message);
                setShowNextForm(false)
                setFormData({
                    topologyDefaultValues: "",
                    normedefaultValue: "",
                    defaultValue: "",
                    brand_name: "",
                    typology:"",
                    inspectorId: "",
                    machineId: "",
                    atex: "",
                    ce: "",
                    inspectorId: "",
                    // inspector_name: "",
                    // inspector_name: "",
                    // norm_specification: "",
                    norm_specification :[],
                    year: "",
                    areaId: "",
                    inspectionId: "",
                    norm: "",
                    arealavoe_defaultvalue: "",
                    notes: "",
                    normeDellData:[],
                    MachineryData:[]
                  });
                setNormeOptions([])
                setMachineryID(null);
                setTopologyName(null);
                setNormeOptions([])
                seteditId(null)
                setCustomDropDownData(false);
                setshowButton(null)
                setCustomDropDownData(false);
                refetch();
                // window.location.reload();
            } else if (response?.data?.status == "ERROR" || response?.data?.status == "FAIL") {
                toast.error(response?.data?.message);
            }

        } catch (error) {
            console.log("error", error);
        }

    }

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
                item?.machinery_info?.norm_specification?.map((spec) => spec.name).join(", ") || null,
                item?.machinery_info?.ce || false,
                item?.machinery_info?.atex || false
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

    // function for import Excel File
    // const handleExcelImportSubmit = (file) => {
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         const data = new Uint8Array(e.target.result);
    
    //         const workbook = XLSX.read(data, { type: "array" });
    //         const sheetName = workbook.SheetNames[0];
    //         const sheet = workbook.Sheets[sheetName];
    //         const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    //         const excelData = transformData(jsonData);
    
    //         setshowFormData((prevData) => {
    //             console.log("prevData", prevData);
    
    //             // If prevData is not an array or missing, default it to an empty array
    //             const prevDataArray = Array.isArray(prevData?.data) ? prevData.data : [];
    
    //             // Process the Excel data into the desired format
    //             const processedExcelData = excelData.map((item) => {
    //                 let matchedItem = { ...item };
    //                 matchedItem.brandName = item["Nome del marchio"] || "";
    //                 matchedItem.machineName = item?.Macchinario || "";
    //                 matchedItem.inspectorName = item?.Ispettore || "";
    //                 matchedItem.areaName = item["Area Lavoro"] || "";
    //                 matchedItem.notes = item?.Notes || "";
    //                 matchedItem.areaId = null;
    //                 matchedItem.machineId = null;
    //                 matchedItem.inspectorId = null;
    
    //                 const matchedArea = workingListing.find(
    //                     (area) =>
    //                         area.wa_name?.toLowerCase() === matchedItem.areaName.toLowerCase()
    //                 );
    //                 if (matchedArea) {
    //                     matchedItem.areaId = matchedArea.id_working_area;
    //                 } else {
    //                     matchedItem.areaName = "";
    //                 }
    
    //                 const matchedMachine = machineListing.find(
    //                     (machine) =>
    //                         machine.name?.toLowerCase() === matchedItem.machineName.toLowerCase()
    //                 );
    
    //                 if (matchedMachine) {
    //                     matchedItem.machineId = matchedMachine.id_machinery_type;
    //                 } else {
    //                     matchedItem.machineName = "";
    //                 }
    
    //                 const matchedInspector = ispectorListing.find(
    //                     (inspector) =>
    //                         inspector.name?.toLowerCase() === matchedItem.inspectorName.toLowerCase()
    //                 );
    
    //                 if (matchedInspector) {
    //                     matchedItem.inspectorId = matchedInspector.id_ispector;
    //                 } else {
    //                     matchedItem.inspectorName = "";
    //                 }
    
    //                 // Construct the object based on your desired structure
    //                 return {
    //                     calendar_info: {
    //                         date: matchedItem.date || "", // Default or from your data
    //                         id_calendar: matchedItem.id_calendar || 0,
    //                     },
    //                     id_inspection: matchedItem.id_inspection || "", // Use Date.now() for unique ID
    //                     id_machinery: matchedItem.machineId || 0,
    //                     id_order: matchedItem.orderId || 23, // Default or from your data
    //                     ispector_info: {
    //                         id_ispector: matchedItem.inspectorId || 0,
    //                         id_user: matchedItem.inspectorId || 0,
    //                         name: matchedItem.inspectorName || "",
    //                         username: matchedItem.inspectorName || "",
    //                     },
    //                     machinery_info: {
    //                         atex: matchedItem.atex || false,
    //                         brand_name: matchedItem.brandName,
    //                         ce: matchedItem.ce || false,
    //                         id_machinery_type: matchedItem.machineId || 0,
    //                         name: matchedItem.machineName || "",
    //                         norm_specification: matchedItem.norm_specification || [],
    //                         time: matchedItem.time || "",
    //                         typology: matchedItem.typology || "",
    //                         year: matchedItem.year || null,
    //                     },
    //                     notes: matchedItem.notes,
    //                     state: matchedItem.state || false,
    //                     time: matchedItem.time || "",
    //                     working_area_info: {
    //                         id_working_area: matchedItem.areaId || null,
    //                         wa_name: matchedItem.areaName || "",
    //                     },
    //                 };
    //             });
    //             return { ...prevData, data: { inspections: [...prevDataArray, ...processedExcelData] } };
    //         });
    //     };
    
    //     reader.readAsArrayBuffer(file); 
    //     setIsExcelPopupOpen(false);
    // };
    

      
        
        // Trigger file reading
                 

    //   const handleExcelImportButton =()=>{
    //     setIsExcelPopupOpen(true);
    //   }

    //   const handleSubmitExcel = (e)=>{
    //    e.preventDefault();
    //    setshowButton("excel")
    //    handleExcelImportSubmit(file);
    // //    setShowNextForm(true)
    
    //   }
    //   const handleFileChange = (event) => {
    //     const selectedFile = event.target.files[0];
    //     if (selectedFile) {
    //       setFile(selectedFile);
    //     }
    //   };

    //   const handleCloseExcel = ()=>{
    //     setFile(null)
    //     setIsExcelPopupOpen(false);
    //   }
    

   


    return (
        <>
        {isFetching && (<Loader />)}
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
                                {findAreaByKeyPrefix('FormArea8',{showModal}) || <div>- -</div>}
                            </div>
                            <div className="ispezione-detaBox">
                                {/* {findAreaByKeyPrefix('EditArea1') || <div>- -</div>} */}
                                {findAreaByKeyPrefix('EditArea2', { handleSubmit }) || <div>- -</div>}

                            </div>
                            {findAreaByKeyPrefix('EditArea3', { stateListing, status, setStatus }) || <div>- -</div>}

                        </div>
                        {findAreaByKeyPrefix('EditArea4',{handleSubmit,showNextForm}) || <div>- -</div>}

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
                                        {findAreaByKeyPrefix('EditButtonArea0', { handleClientSubmit,addButttonApi,handleSubmit}) || <div>- -</div>}
                                        {showNextForm && showButton == "add" ? (
                                            findAreaByKeyPrefix('EditButtonArea1', { handleSubmit }) || <div>- -</div>
                                        ) : showButton == "edit" ? (
                                            findAreaByKeyPrefix('EditButtonArea4', { submitEditedForm }) || <div>- -</div>
                                        ) : ""}
                                    </div>
                                    <div className="btn-set-right">
                                        {findAreaByKeyPrefix('EditButtonArea2'
                                        // {handleExcelImportButton}
                                        ) || <div>- -</div>}
                                        {/* {isExcelPopupOpen && (
                                            <div>  
                                                    <form onSubmit={handleSubmitExcel}>            
                                                    <input
                                                      type="file"
                                                      accept=".xlsx,.xls"
                                                      className="form-control"
                                                      onChange={handleFileChange}
                                                      />
                                            <button variant="primary" type="submit">
                                             Upload
                                            </button>
                                            <button variant="primary" onClick={handleCloseExcel}>
                                             Close
                                            </button>

                                            </form>
                                                 </div>
                                        )} */}

                                        {findAreaByKeyPrefix('EditButtonArea3',{exportToExcel}) || <div>- -</div>}
                                    </div>
                                </div>
                                {/* form-btn-sets END */}
                            </div>
                            {/* Add Element */}


                            {showNextForm && (
                                <div className="new-added" >
                                    {findAreaByKeyPrefix('EditArea9') || <div>- -</div>}
                                    {findAreaByKeyPrefix('BodyArea',{handleClose}) || <div>- -</div>}
                                    <div className="row row-gap">
                                        {findAreaByKeyPrefix('EditArea13', { machineTypology, handleSelectMachineryTopology, formData,errors,topologyName}) || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditArea14', { MachineryData: formData?.MachineryData, formData, handleSelectChange,errors,MachineryID }) || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditArea10', { normeDellData : formData?.normeDellData, handleSelectMachinery, formData,errors }) || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditArea15', { formValues: formData.year , formName: { name: "year",type :"number" }, ...(customDropDownData && {handleNotes :handleYear,formData})}) || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditArea17', { formData,
                                        handleSelectNormeListing,normeListing,normeOptions,setNormeOptions,customDropDownData
                                         }) || <div>- -</div>}
                                        <div className="col-md-4">
                                            <div className="form-custom-check inline-check ccmt-50">
                                                {findAreaByKeyPrefix('EditCheckArea1', { formValues: formData, ...(customDropDownData && { handleChange :handleChangeeditCheckBox1 })}) || <div>- -</div>}
                                                {findAreaByKeyPrefix('EditCheckArea2', { formValues: formData,...(customDropDownData && { handleChange :handleChangeeditCheckBox2 }) }) || <div>- -</div>}
                                            </div>
                                        </div>

                                        {findAreaByKeyPrefix('EditArea12', { handleSelectArea, formData, workingListing,errors }) || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditArea11', { formData, formValues: formData?.inspector_name, formData, ispectorListing, handleSelectIspector,errors }) || <div>- -</div>}
                                        {findAreaByKeyPrefix('EditArea16', { formData, formValues: formData.notes, handleNotes, formName: { name: "notes",type :"text" } }) || <div>- -</div>}

                                    </div>
                                </div>
                            )}
                            {findAreaByKeyPrefix('EditTableArea', {
                                rzOrderdetails, deleteInspection,
                                showModal, setShowModal, handleModal,
                                handleFormPage,
                                showFormData,
                                modalRef
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
