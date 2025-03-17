import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../../lib/loader/loader";
import { useDeleInspectionMutation, useGetOdersIspezione0Query, useGetOdersIspezione1Query, useGetUserDetailsQuery } from "../../services/apiSlice";

const MainLayout2 = ({ areas }) => {

    const [searchText1, setSearchText1] = useState("");
    const [searchText2, setSearchText2] = useState("");
    const [currentPage1, setCurrentPage1] = useState(1);
    const [currentPage2, setCurrentPage2] = useState(1);
    const [showModal, setShowModal] = useState();
    const [deletedInspectionId, setDeletedInspectionId] = useState(null);
    const modalRef = useRef(null);
    const findAreaByKeyPrefix = (prefix, extraProps = {}) => {
        const area = areas.find(area => area?.key && area?.key.startsWith(prefix));
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

    const allApis = areas.filter((item) => item?.key == "PaginationArea1-10");

    const getapi = allApis?.reduce((acc, user) => {
        const function_Name = user?.props?.children?.props?.children?.props?.api?.function_name;
        if (function_Name && acc === undefined) {
            return { getOdersIspezione: function_Name }
        }
        return acc
    }, undefined)


    const apiData = areas?.find(
        (item) => item?.props?.children?.props?.children?.[0]?.props?.areas?.element_type === "table"
    );

    const getDeleteApi = apiData?.props?.children?.props?.children?.[0]?.props?.nestedElements?.reduce((acc, data) => {
        const function_name = data?.props?.children?.props?.children?.props?.api?.function_name;
        const methodType = data?.props?.children?.props?.children?.props?.api?.method_type;
        if (function_name && acc === undefined) {
            return { deleteUrl: function_name, deleteMethod: methodType }
        }

        return acc;
    }, undefined);

    let getApis = areas.filter((item) => item?.props?.children?.props?.children?.props?.api != null
    ).reduce((acc, user) => {
        const key = user?.key;
        console.log("MainBodyArea4", key)
        const functionName = user.props.children.props.children.props.api.function_name;
        const api_Method = user?.props?.children?.props?.children?.props?.api?.method_type;

        if (key?.includes("HeaderArea4-3")) {
            acc.userDetailsApi = functionName;
            acc.userDetailsApiMethod = api_Method;
        }
        return acc;
    }, {})

    

    const [deleInspection] = useDeleInspectionMutation();

    const handleModal = (id) => {
        setDeletedInspectionId(id)
        setShowModal(true);
    }

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
 
    const deleteInspection = async () => {
        try {
            const response = await deleInspection({
                url: getDeleteApi?.deleteUrl,
                method: getDeleteApi?.deleteMethod,
                id: deletedInspectionId,
            });

            if (response?.data?.status == "SUCCESS") {
                toast.success(response?.data?.message);
                setShowModal(false);
                tableTwoRefetch()
                refetch()
            } else {
                toast.error(response?.data?.message);
            }
        } catch (error) {
            console.error("Error deleting inspection:", error);
        }
    };

    const { data: TableData2, isFetching, refetch: tableTwoRefetch } = useGetOdersIspezione0Query({
        endpointName: getapi.getOdersIspezione,
        method: getapi.getOdersIspezioneApiMethod,
        params: {
            id_state: 0,
            page: currentPage2,
            ...(searchText2 ? { search: searchText2 } : {}),
        },
        refetchOnMountOrArgChange: true,
    })

    const { data: TableData1, isFetching: isFetching1, refetch } = useGetOdersIspezione1Query({
        endpointName: getapi.getOdersIspezione,
        method: getapi.getOdersIspezioneApiMethod,
        params: {
            id_state: 1,
            page: currentPage1,
            ...(searchText1 ? { search: searchText1 } : {}),
        },
        refetchOnMountOrArgChange: true,
    })

    let perPageItem1 = TableData1?.pagination?.per_page;
    const totalDocuments1 = TableData1?.pagination?.total_items;

    let perPageItem2 = TableData2?.pagination?.per_page;
    const totalDocuments2 = TableData2?.pagination?.total_items;

    const handlePageClick = ({ selected }) => {
        setCurrentPage1(selected + 1)
    };

    const handlePageClick2 = ({ selected }) => {
        setCurrentPage2(selected + 1)
    };
    
    // user details
   const {data: userDetails, error , isFetchingg} = useGetUserDetailsQuery({
    url: getApis?.userDetailsApi,
    method: getApis?.userDetailsApiMethod,
    refetchOnMountOrArgChange: true,
    })


    return (
        <>
            {(isFetching || isFetching1) && <Loader />}
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
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards-block Ispezioni-block">
                                <div className="card-header border-0 add-form-header pb-0">
                                    <div className="card-title">
                                        {findAreaByKeyPrefix('IspezioniFormArea1') || <div>- -</div>}
                                        {findAreaByKeyPrefix('IspezioniTableNameArea1') || <div>- -</div>}
                                    </div>
                                    {findAreaByKeyPrefix('IspezioniSearchArea1', { searchText: searchText1, setSearchText: setSearchText1 }) || <div>- -</div>}
                                </div>
                                <div className="card-block-body">
                                    {findAreaByKeyPrefix('IspezioniArea1', { TableData1 }) || <div>- -</div>}
                                    {totalDocuments1 > perPageItem1 && (
                                        findAreaByKeyPrefix('PaginationArea1', { totalDocuments: totalDocuments1, currentPage: currentPage1, perPageItem: perPageItem1, handlePageClick }) || <div>- -</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid p-0">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards-block Ispezioni-block">
                                <div className="card-header border-0 add-form-header pb-0">
                                    <div className="card-title">
                                        {findAreaByKeyPrefix('IspezioniFormArea2') || <div>- -</div>}
                                        {findAreaByKeyPrefix('IspezioniTableNameArea2') || <div>- -</div>}
                                    </div>
                                    {findAreaByKeyPrefix('IspezioniSearchArea2', { searchText: searchText2, setSearchText: setSearchText2 }) || <div>- -</div>}
                                </div>
                                <div className="card-block-body">
                                    {findAreaByKeyPrefix('IspezioniArea2', { TableData2, handleModal, modalRef, deleteInspection, showModal, setShowModal }) || <div>- -</div>}
                                    {totalDocuments2 > perPageItem2 && (
                                        findAreaByKeyPrefix('PaginationArea1', { totalDocuments: totalDocuments2, currentPage: currentPage2, perPageItem: perPageItem2, handlePageClick2 }) || <div>- -</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MainLayout2;
