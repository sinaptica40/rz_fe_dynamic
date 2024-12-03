import React from "react";

import { useLocation, useNavigate,useParams } from "react-router-dom";
import { useState, useEffect,useCallback } from "react";
import { useAddMachineryMutation, useEditMachineryMutation, useGetEditNormDataQuery,useGetNormeLanguageQuery, useGetNormeStandardTypeQuery } from "../../services/apiSlice";

const MainLayout4 = ({ areas }) => {
    const location = useLocation();
    const route = location.pathname.substring('/');

   
    const navigate = useNavigate();
    const params = useParams();



    const [formValues, setFormValues] = useState({
        name: "",
        brand_name: "",
        typology: "",
        norm_specification: [],
        atex: false,
        ce: false,
        year: "",
    });
    const [normeOptions, setNormeOptions] = useState([]);
    const [selectedNormsByType, setSelectedNormsByType] = useState({});
    const [selectedOption, setSelectedOption] = useState([]);
    const [isSelectActive, setIsSelectActive] = useState(false);

    const [errors, setErrors] = useState({});

    // const handleClose=()=>{
    //     navigate(-1);
    // }

    // Helper function to find area by key prefix (e.g., 'HeaderArea1')
    // const findAreaByKeyPrefix = (prefix) => areas.find(area => area.key && area.key.startsWith(prefix));

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

                    return child; // Return non-element children as is (e.g., strings, numbers)
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

    let allApis = areas.filter((item) => {
        return item?.props?.children?.props?.children?.props?.api != null;
    });

    

    let getapi;
    getapi = allApis.reduce((acc, user) => {

       
        const functionName = user.props.children.props.children.props.api.function_name;
        const api_Method = user?.props?.children?.props?.children?.props?.api?.method_type;

        if (functionName.includes("add-machinery")) {
            acc.addMachinery = functionName;
            acc.addMachineryApiMethod = api_Method;
        }
        if (functionName.includes("standard-types")) {
            acc.standardApi = functionName;
            acc.standardTypeApiMethod = api_Method;
        }
        if (functionName.includes("get-norme")) {
            acc.getNormeApi = functionName;
            acc.getNormeApiMethod = api_Method;
        }
        if (functionName.includes("edit-machinery")) {
            acc.editApi = functionName;
            acc.editApiMethod = api_Method;
        }
        if (functionName.includes("get-machinery?id_machinery_type=".toLowerCase())) {
            acc.getEditNorme = functionName;
            acc.getApiMethod = api_Method;
        }
        return acc;
    }, {});

   
   

    const { data: standardData } = useGetNormeStandardTypeQuery({
        endpointName: getapi.standardApi,
        method: getapi.standardTypeApiMethod,

    });

    const { data: normeData } = useGetNormeStandardTypeQuery({
        endpointName: getapi.getNormeApi,
        method: getapi.getNormeApiMethod,
        

    });
    const edit_id = localStorage.getItem("machinery_id")

    const {data:editNormedata ,isFetching,refetch} =  useGetEditNormDataQuery({
        url:getapi.getEditNorme,
        method: getapi.getApiMethod,
        params :{
            id:`${edit_id}`,
        }
    })



    useCallback(()=>{
        if(params["*"]){
             refetch();
          getapi={}
         
      }
    },[params["*"]])  

    
    
    useEffect(() => {
        const clearLocalStorageOnRouteChange = () => {
          refetch();
        };
        clearLocalStorageOnRouteChange();
    }, [location.pathname]);

    
    useEffect(() => {
        if (editNormedata?.data && !isFetching) {
            const editValue = editNormedata?.data;           
            setFormValues({
                name: editValue?.name || "",
                brand_name: editValue?.brand_name || "",
                typology: editValue?.typology || "",
                norm_specification: editValue?.norm_specification || [],
                atex: editValue?.atex || false,
                ce: editValue?.ce || false,
                year: editValue?.year || "",
                id_standard :editValue.id_machinery_type|| "",
                id_standard_type:editValue?.norm_specification[0]?.id_standard_type
            });
            console.warn("formmmmmmmeeeeeee",formValues.norm_specification)
            console.log("selectedNormsByType[[[[[[]]]]]]:", formValues.id_standard);
            
            if (editValue?.norm_specification[0]?.id_standard_type) {
                const normSpecificationOptions =
                    normeData?.data
                        ?.filter((item) => item.id_standard_type == editValue?.norm_specification[0]?.id_standard_type)
                        .map((item) => ({
                            value: item.id_standard,
                            label: item.name,
                        })) || [];
             
                setNormeOptions(normSpecificationOptions);

                const previouslySelected = [editValue?.norm_specification[0]?.id_standard ]|| [];
             

                // const previouslySelected = [editValue?.id_machinery_type] || [];
                // const previouslySelected = selectedNormsByType[editValue?.norm_specification[0]?.id_standard_type] || [];
                
                console.warn("]]]]]]]",previouslySelected)
           
                let arr= editValue?.norm_specification.map((it)=>({
                    value:it?.id_standard,
                    label: it?.name,
                }))
                setSelectedOption(arr); 

    
                setFormValues((prevData) => ({
                    ...prevData,
                    norm_specification:  previouslySelected,
                }));
            }
            console.warn("Final formValues:", formValues);
        }
    }, [editNormedata, isFetching]);
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormValues((prevData) => ({
                ...prevData,
                [name]: checked,
            }));
        } else {
            setFormValues((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }


        if (name === "id_standard_type") {
            const normSpecificationOptions =
                normeData?.data
                    ?.filter((item) => item.id_standard_type == value)
                    .map((item) => ({
                        value: item.id_standard,
                        label: item.name,
                    })) || [];
         
            setNormeOptions(normSpecificationOptions);

            const previouslySelected = selectedNormsByType[value] || [];
        
            setSelectedOption(previouslySelected);

            setFormValues((prevData) => ({
                ...prevData,
                norm_specification: previouslySelected.map((option) => option.value),
            }));
        }

        if (name === "year" && value !== "" && !Number.isInteger(Number(value))) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                year: "Please enter a valid year. The value must be a number.",
            }));
            return;
        }

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "",
        }));
    };


    const handleSelectChange = (selectedOptions) => {

        const selectedValues = selectedOptions.map((option) => option.value);

        setSelectedOption(selectedOptions);

        setFormValues((prevData) => ({
            ...prevData,
            norm_specification: selectedValues,
        }));
        

        setSelectedNormsByType((prevState) => ({
            ...prevState,
            [formValues.id_standard_type]: selectedOptions,
        }));

        setIsSelectActive(selectedOptions && selectedOptions.length > 0);
   
        setErrors((prevErrors) => ({
            ...prevErrors,
            norm_specification: "",
        }));
    };


    const validate = () => {
        const newErrors = {};

        if (!formValues.name) {
            newErrors.name = "Nome Macchinario is required.";
        }

        if (!formValues.id_standard_type) {
          newErrors.id_standard_type = "Blocco Norme Base is required.";
        }

        if (!formValues.year){
          newErrors.year = "Costrizione is required.";
        }

        if (formValues.year.toString().length > 5) {
          newErrors.year = "Costrizione must be 5 digits or less.";
        }

        // if (!fromData.type) {
        //   newErrors.type = "Tipologia Macchinario is required.";
        // }

        if (formValues.norm_specification.length === 0) {
            newErrors.norm_specification =
                "At least one Norma Specifica must be selected.";
        }
        // setErrors(newErrors);
        // return Object.keys(newErrors).length === 0;
        return newErrors;
    };





    const [addMachinery] = useAddMachineryMutation();

    const [EditMachinery] = useEditMachineryMutation()

    // const editMachineryData = JSON.parse(localStorage.getItem("NormeItemData"));
    // console.warn("editMachineryData:", editMachineryData); 
    // useEffect(() => {
    //     if (editMachineryData) {

    //         setFormValues({
    //             name: editMachineryData?.name || "",
    //             brand_name: editMachineryData?.brand_name || "",
    //             typology: editMachineryData?.typology || "",
    //             norm_specification: editMachineryData?.norm_specification || [],
    //             atex: editMachineryData?.atex || false,
    //             ce: editMachineryData?.ce || false,
    //             year: editMachineryData?.year || "",
    //             id_standard  :editMachineryData?.id_machinery_type|| "",
    //         });
    //     }
    // }, [getapi?.editApi == route]);

   


    useEffect(() => {
        const clearLocalStorageOnRouteChange = () => {
            localStorage.removeItem("NormeItemData");
        };
        clearLocalStorageOnRouteChange();
    }, [location.pathname]);


    const handleSubmit = async (e) => {
        e.preventDefault();


        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // if (!formValues.id_standard_type) {
        //     formValues.id_standard_type = "1";
        // }

        // if (!formValues.language) {
        //     formValues.language = "EN";
        // }
    
        
        const { id_standard_type, ...filteredFormValues } = formValues;

        
    //    console.warn("formvalue",formValues)
    //    console.warn("filtfhhf",filteredFormValues)
        try {
            if (getapi?.addMachinery) {

                let obj = {
                    url: getapi.addMachinery,
                    method: getapi.addMachineryApiMethod,
                    data: filteredFormValues
                }
                console.warn("obj.data",obj.data)
                const res = await addMachinery(obj);
               
                if (res?.data?.status === "success" || res?.data?.status === "SUCCESS") {
                    navigate(`/${res?.data?.navigate}`);
                } else {
                    console.error(res?.error?.data?.message || "An error occurred");

                }
                // if (res?.data?.status === "success" || res?.data?.status === "SUCCESS") {
                //     console.warn("Machinery added successfully:", res);
                //     // navigate("/5");
                //     // location.reload(); 
                // } else {
                //     console.error(res?.error?.data?.message || "An error occurred");
                // }
            }
            
            else if(getapi?.editApi){
                const objEdit ={
                    url:getapi.editApi,
                    method:getapi.editApiMethod,
                    params : edit_id,
                    // params: editMachineryData?.id_machinery_type,
                    data:formValues,
                }
                console.warn("aasdsdffssdfd",objEdit.data)
                const res = await EditMachinery(objEdit);
               

                console.warn("API Response of editMachinery:", res);
                if (res?.data?.status === "success" || res?.data?.status === "SUCCESS") {
                //    navigate(res?.data?.navigate);
                   navigate(`/${res?.data?.navigate}`);
                   
                } else {
                    console.error(res?.error?.data?.message || "An error occurred");
                
            }

            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    
    };

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
                        {/* {findAreaByKeyPrefix('FormArea8') || <div>- -</div>} */}
                        <div className="card-header border-0 add-form-header">
                            <div className="card-title">
                                {findAreaByKeyPrefix('FormArea7') || <div>- -</div>}
                                {findAreaByKeyPrefix('FormArea8') || <div>- -</div>}
                            </div>
                            {/* <a 
                            
                            onClick={handleClose}
                            className="close-iconBtn">
                                <svg
                                    width={26}
                                    height={26}
                                    viewBox="0 0 26 26"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1.05096 1.10498C1.21899 0.936596 1.41859 0.803006 1.63831 0.711857C1.85804 0.620708 2.09358 0.573792 2.33146 0.573792C2.56934 0.573792 2.80489 0.620708 3.02462 0.711857C3.24434 0.803006 3.44393 0.936596 3.61196 1.10498L13.184 10.681L22.756 1.10498C23.0968 0.771233 23.5555 0.58543 24.0325 0.587931C24.5095 0.590431 24.9663 0.781033 25.3036 1.11834C25.6409 1.45564 25.8315 1.9124 25.834 2.38941C25.8365 2.86642 25.6507 3.32516 25.317 3.66598L15.741 13.238L25.317 22.81C25.6507 23.1508 25.8365 23.6095 25.834 24.0865C25.8315 24.5636 25.6409 25.0203 25.3036 25.3576C24.9663 25.6949 24.5095 25.8855 24.0325 25.888C23.5555 25.8905 23.0968 25.7047 22.756 25.371L13.184 15.795L3.61196 25.371C3.27114 25.7047 2.81241 25.8905 2.3354 25.888C1.85838 25.8855 1.40162 25.6949 1.06432 25.3576C0.727017 25.0203 0.536415 24.5636 0.533915 24.0865C0.531414 23.6095 0.717216 23.1508 1.05096 22.81L10.627 13.238L1.05096 3.66598C0.88258 3.49795 0.748989 3.29836 0.657841 3.07863C0.566692 2.85891 0.519775 2.62336 0.519775 2.38548C0.519775 2.1476 0.566692 1.91205 0.657841 1.69233C0.748989 1.4726 0.88258 1.27301 1.05096 1.10498Z"
                                        fill="currentcolor"
                                    />
                                </svg>
                            </a> */}
                            {findAreaByKeyPrefix('EditArea4') || <div>- -</div>}
                        </div>
                        <div className="form-input-block">
                            <form onSubmit={handleSubmit}>
                                <div className="row row-gap">
                                    {/* <div className="col-md-6"> */}


                                    {findAreaByKeyPrefix('FormArea10', { handleChange, errors, formValues }) || <div>- -</div>}
                                    {findAreaByKeyPrefix('FormArea15', { handleChange, errors, formValues }) || <div>- -</div>}
                                    {findAreaByKeyPrefix('FormArea13', { handleChange, errors, formValues }) || <div>- -</div>}
                                    {findAreaByKeyPrefix('FormArea9', { handleChange, errors, formValues }) || <div>- -</div>}
                                    <div className="col-md-2">
                                        <div className="form-custom-check inline-check ccmt-50">
                                            {findAreaByKeyPrefix('EditCheckArea1', { formValues, errors, handleChange }) || <div> -- </div>}
                                            {findAreaByKeyPrefix('EditCheckArea2', { formValues, errors, handleChange }) || <div> -- </div>}
                                        </div>
                                    </div>
                                    {findAreaByKeyPrefix('FormArea16', { handleChange, errors, formValues, standardData }) || <div>- -</div>}
                                    {findAreaByKeyPrefix('FormArea12', { handleSelectChange, errors, formValues, normeOptions, selectedOption, isSelectActive }) || <div>- -</div>}

                                    {/* {findAreaByKeyPrefix('FormArea11') || <div>- -</div>}   */}

                                    {/* </div> */}
                                    <div className="col-md-12">
                                        {findAreaByKeyPrefix('FormArea14') || <div>- -</div>}
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MainLayout4;
