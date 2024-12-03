import React, { useState, useEffect } from "react";
import moment from 'moment';
import { useGetRzOrderQuery } from "../../services/apiSlice";
import { toast } from "react-toastify";
import { useCallback } from "react";
import { useMemo } from "react";

const MainLayout6 = ({ areas }) => {
    const ispenzioViewID = localStorage.getItem("ispenzioViewID");

    const [clientformData, setClientformData] = useState({
        description: "",
        created_by: "",
        client: "",
        orderId: "",
        date: null,
    });

    const [totalDataLength, setTotalDataLength] = useState([])

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
            if (function_name.includes("/api/v1/inspections/rz-order")) {
                acc.getRzOrderUrl = function_name;
                acc.getRzOrderMethod = apiMethod
            }
            return acc;
        }, {})


    const { data: rzOrderdetails, refetch } = useGetRzOrderQuery({
        url: filterApi.getRzOrderUrl,
        params: ispenzioViewID,
        refetchOnMountOrArgChange: true,
    });

    console.log("ispenzioViewID", rzOrderdetails);









    useEffect(() => {
        if (rzOrderdetails) {

            let datas = rzOrderdetails?.data;
            setTotalDataLength(datas?.inspections?.length);

            console.log("datas", datas);
            const clientData = {
                client: datas?.client,
                description: datas?.description,
                date: datas?.inspections?.[0]?.calendar_info?.date,
                created_by: datas?.created_by_name,
                machinery_info :datas?.inspections

            }

            setClientformData(clientData);

        }
    }, [rzOrderdetails?.data])

    console.log("totalDataLength", totalDataLength)

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
                            {findAreaByKeyPrefix('ViewIdArea') || <div>- -</div>}
                            <div className="action_dropdownBox">
                                <div className="dropdown">
                                    <span className="dropdown-item "></span>
                                </div>
                            </div>
                        </div>
                        {findAreaByKeyPrefix('EditArea4') || <div>- -</div>}
                        <div className="form-input-block">
                            <form action="#!">
                                <div className="row row-gap">
                                    {findAreaByKeyPrefix('EditArea5', { value: clientformData?.description, label: "description" }) || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea6', { clientformData }) || <div>- -</div>}
                                    {findAreaByKeyPrefix('EditArea8', { value: clientformData?.created_by, label: "created_by" }) || <div>- -</div>}
                                    {findAreaByKeyPrefix('ViewArea1', { value: clientformData?.date, label: "date" }) || <div>- -</div>}
                                </div>
                            </form>
                            {/* Add Element */}
                            <div className="new-added">
                                <>
                                    {Array.from({ length: totalDataLength }).map((_, index) => (
                                        <div key={index}>
                                            <div className="heading-bg-element mb-4">
                                                <div className="heading-elm-itle">Inspection Item {index + 1}</div>
                                            </div>
                                            <div className="row row-gap">
                                                {findAreaByKeyPrefix('ViewArea2', {  value: clientformData?.machinery_info?.[index]?.machinery_info?.typology, label: "machinery_info" }) || <div>- -</div>}
                                                {findAreaByKeyPrefix('ViewArea3', {  value: clientformData?.machinery_info?.[index]?.machinery_info?.name, label: "name" } ) || <div>- -</div>}
                                                {findAreaByKeyPrefix('ViewArea4', {value: clientformData?.machinery_info?.[index]?.machinery_info?.brand_name, label: "brand_name"  }) || <div>- -</div>}
                                                {findAreaByKeyPrefix('ViewArea5', {value: clientformData?.machinery_info?.[index]?.machinery_info?.year, label: "machinery_info"  }) || <div>- -</div>}
                                                {findAreaByKeyPrefix('ViewArea6',  {value: clientformData?.machinery_info?.[index]?.machinery_info?.norm_specification?.map((item)=>(item?.name)), label: "machinery_info"  }) || <div>- -</div>}
                                                <div className="col-md-4">
                                                <div className="form-custom-check inline-check ccmt-50">
    {findAreaByKeyPrefix('EditCheckArea1', { formValues: { ce: clientformData?.machinery_info?.[index]?.machinery_info?.ce } }) || <div>- -</div>}
    {findAreaByKeyPrefix('EditCheckArea2', { formValues: { atex: clientformData?.machinery_info?.[index]?.machinery_info?.atex } }) || <div>- -</div>}
</div>

                                                </div>
                                                {findAreaByKeyPrefix('ViewArea7', { value: clientformData?.machinery_info?.[index]?.ispector_info?.name, label: "ispector_info" }) || <div>- -</div>}
                                                {findAreaByKeyPrefix('ViewArea8', { value: clientformData?.machinery_info?.[index]?.working_area_info?.wa_name, label: "wa_name"  }) || <div>- -</div>}
                                                {findAreaByKeyPrefix('ViewArea9', { value: clientformData?.machinery_info?.[index]?.notes, label: "notes"  }) || <div>- -</div>}
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
