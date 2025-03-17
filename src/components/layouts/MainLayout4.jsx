import React from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { useAddMachineryMutation, useEditMachineryMutation, useGetEditNormDataQuery, useGetNormeLanguageQuery, useGetNormeStandardTypeQuery, useGetUserDetailsQuery } from "../../services/apiSlice";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

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

    const findAreaByKeyPrefix = (prefix, extraProps = {}) => {
        const area = areas.find(area => area.key && area.key.startsWith(prefix));
        if (area) {
            const deepCloneChildren = (children, extraProps) => {
                return React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        const clonedChild = React.cloneElement(child, { ...extraProps });

                        if (child.props && child.props.children) {
                            const updatedChildren = deepCloneChildren(child.props.children, extraProps);
                            return React.cloneElement(clonedChild, { children: updatedChildren });
                        }

                        return clonedChild;
                    }

                    return child;
                });
            };

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
        const key = user?.key
        const functionName = user.props.children.props.children.props.api.function_name;
        const api_Method = user?.props?.children?.props?.children?.props?.api?.method_type;

        console.log("functionName", functionName);

        if (key.includes("FormArea14")) {
            acc.addMachinery = functionName;
            acc.addMachineryApiMethod = api_Method;
        }
        if (key.includes("FormArea16")) {
            acc.standardApi = functionName;
            acc.standardTypeApiMethod = api_Method;
        }
        if (key.includes("FormArea12")) {
            acc.getNormeApi = functionName;
            acc.getNormeApiMethod = api_Method;
        }
        if (key.includes("FormArea14")) {
            acc.editApi = functionName;
            acc.editApiMethod = api_Method;
        }
        if (key.includes("FormArea8")) {
            acc.getEditNorme = functionName;
            acc.getApiMethod = api_Method;
        }
        if (key?.includes("HeaderArea4-3")) {
            acc.userDetailsApi = functionName;
            acc.userDetailsApiMethod = api_Method;
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

    const { data: editNormedata, isFetching, refetch } = useGetEditNormDataQuery(
        edit_id ? {
            url: getapi.getEditNorme,
            method: getapi.getApiMethod,
            params: {
                id: `${edit_id}`,
            }
        } : null
    )

    useCallback(() => {
        if (params["*"]) {
            refetch();
            getapi = {}

        }
    }, [params["*"]])

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
                name: editValue?.name || null,
                brand_name: editValue?.brand_name || null,
                typology: editValue?.typology || null,
                norm_specification: editValue?.norm_specification || [],
                atex: editValue?.atex || false,
                ce: editValue?.ce || false,
                year: editValue?.year || null,
                id_standard: editValue.id_machinery_type || null,
                id_standard_type: editValue?.norm_specification[0]?.id_standard_type
            });

            if (editValue?.norm_specification[0]?.id_standard_type) {
                const normSpecificationOptions =
                    normeData?.data
                        ?.filter((item) => item.id_standard_type == editValue?.norm_specification[0]?.id_standard_type)
                        .map((item) => ({
                            value: item.id_standard,
                            label: item.name,
                        })) || [];

                setNormeOptions(normSpecificationOptions);

                const previouslySelected = [editValue?.norm_specification[0]?.id_standard] || [];

                let arr = editValue?.norm_specification.map((it) => ({
                    value: it?.id_standard,
                    label: it?.name,
                }))
                setSelectedOption(arr);

                setFormValues((prevData) => ({
                    ...prevData,
                    norm_specification: previouslySelected,
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
            newErrors.name = "Nome Macchinario è obbligatorio.";
        }
        if (!formValues.typology) {
            newErrors.typology = "è richiesta la tipologia";
        }

        // if (!formValues.id_standard_type) {
        //     newErrors.id_standard_type = "Blocco Norme Base is required.";
        // }

        // if (!formValues.year) {
        //     newErrors.year = "Costrizione is required.";
        // }

        // if (formValues.year.toString().length > 5) {
        //     newErrors.year = "Costrizione must be 5 digits or less.";
        // }

        // if (formValues.norm_specification.length === 0) {
        //     newErrors.norm_specification =
        //         "At least one Norma Specifica must be selected.";
        // }
        return newErrors;
    };

    const [addMachinery] = useAddMachineryMutation();

    const [EditMachinery] = useEditMachineryMutation()

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

        const addMachineryValue = {
            brand_name: formValues?.brand_name || "Altro marchio",
            typology: formValues?.typology || null,
            atex: formValues?.atex || false,
            ce: formValues?.ce || false,
            name: formValues?.name || null,
            year: parseInt(formValues?.year) || null,
            norm_specification: formValues?.norm_specification || null

        }

        try {
            if (getapi?.addMachinery && getapi?.addMachineryApiMethod == "POST") {
                let obj = {
                    url: getapi.addMachinery,
                    method: getapi.addMachineryApiMethod,
                    data: addMachineryValue
                }

                const res = await addMachinery(obj);

                if (res?.data?.status === "success" || res?.data?.status === "SUCCESS") {
                    navigate(`/${res?.data?.navigate}`);
                    toast.success(res?.data?.message);
                } else {
                    toast.error(res?.data?.message);
                    console.error(res?.error?.data?.message || "An error occurred");

                }
            } else if (getapi?.editApi && getapi?.editApiMethod == "PUT") {
                const EditMachineryValue = {
                    brand_name: formValues?.brand_name || null,
                    typology: formValues?.typology || null,
                    atex: formValues?.atex || false,
                    ce: formValues?.ce || false,
                    // id_standard_type: formValues?.id_standard_type || null,
                    name: formValues?.name || null,
                    year: parseInt(formValues?.year) || null,
                    norm_specification: formValues?.norm_specification || null

                }
                const objEdit = {
                    url: getapi.editApi,
                    method: getapi.editApiMethod,
                    params: edit_id,
                    data: EditMachineryValue,
                }

                const res = await EditMachinery(objEdit);

                if (res?.data?.status === "success" || res?.data?.status === "SUCCESS") {
                    localStorage.removeItem("machinery_id")
                    toast.success(res?.data?.message);
                    navigate(`/${res?.data?.navigate}`);
                } else {
                    toast.error(res?.data?.message);
                    console.error(res?.error?.data?.message || "An error occurred");
                }
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    // user details
   const {data: userDetails, error , isFetchingg} = useGetUserDetailsQuery({
    url: getapi?.userDetailsApi,
    method: getapi?.userDetailsApiMethod,
    refetchOnMountOrArgChange: true,
    })

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
                                {/* {findAreaByKeyPrefix('HeaderArea3') || <div>- -</div>} */}
                                {findAreaByKeyPrefix('HeaderArea4', { userDetails }) || <div>- -</div>}
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
                        <div className="card-header border-0 add-form-header">
                            <div className="card-title">
                                {findAreaByKeyPrefix('FormArea7') || <div>- -</div>}
                                {findAreaByKeyPrefix('FormArea8') || <div>- -</div>}
                            </div>
                            {findAreaByKeyPrefix('EditArea4') || <div>- -</div>}
                        </div>
                        <div className="form-input-block">
                            <form onSubmit={handleSubmit}>
                                <div className="row row-gap">
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
