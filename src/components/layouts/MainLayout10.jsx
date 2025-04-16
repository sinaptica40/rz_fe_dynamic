import React, { useState, useRef, useEffect } from "react";
import Loader from "../../lib/loader/loader";
import { useGetOdersIspezione1Query, useGetUserDetailsQuery } from "../../services/apiSlice";

const MainLayout10 = ({ areas }) => {

    const [searchText1, setSearchText1] = useState("");
    const [debouncedSearchText, setDebouncedSearchText] = useState(searchText1);
    const [currentPage1, setCurrentPage1] = useState(1);
    const [showModal, setShowModal] = useState();
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

    const allApis = areas.filter((item) => item?.key === "IspezioniArea1-4");

    const getapi = allApis?.reduce((acc, user) => {
        const function_Name = user?.props?.children?.props?.children?.props?.api?.function_name;
        const function_Method = user?.props?.children?.props?.children?.props?.api?.method_type;
        if (function_Name && acc === undefined) {
            return { getOdersIspezione: function_Name, getOdersIspezioneApiMethod: function_Method }
        }
        return acc
    }, undefined)

    const getApi = areas.filter(
        (item) => item?.props?.children?.props?.children?.props?.api != null)
        .reduce((acc, user) => {
            const key = user?.key;
            const function_name = user?.props?.children?.props?.children?.props?.api?.function_name;
            const apiMethod = user?.props?.children?.props?.children?.props?.api?.method_type;

            if (key?.includes("HeaderArea4-3")) {
                acc.userDetailsApi = function_name;
                acc.userDetailsApiMethod = apiMethod;
            }

            return acc;
        }, {})

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
    const debounceDelay = 500;

// Update the debounced search text after the delay
useEffect(() => {
    const handler = setTimeout(() => {
        setDebouncedSearchText(searchText1);
    }, debounceDelay);

    // Clean up the previous timeout if searchText1 changes before the delay
    return () => {
        clearTimeout(handler);
    };
}, [searchText1]);



    const { data: TableData1, isFetching: isFetching1, refetch } = useGetOdersIspezione1Query({
        endpointName: getapi.getOdersIspezione,
        method: getapi.getOdersIspezioneApiMethod,
        params: {
            id_state: 0,
            page: currentPage1,
            ...(debouncedSearchText ? { search: debouncedSearchText } : {}),
        },
        refetchOnMountOrArgChange: true,
    })

    let perPageItem1 = TableData1?.pagination?.per_page;
    const totalDocuments1 = TableData1?.pagination?.total_items;


    const handlePageClick = ({ selected }) => {
        setCurrentPage1(selected + 1)
    };

    // user details
   const {data: userDetails, error , isFetchingg} = useGetUserDetailsQuery({
    url: getApi?.userDetailsApi,
    method: getApi?.userDetailsApiMethod,
    refetchOnMountOrArgChange: true,
    })

    return (
        <>
            {(isFetching1) && <Loader />}
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
                            <div className="cards-block Ispezioni-block card-block-body">
                                <div className="card-header border-0 add-form-header pb-0">
                                    <div className="card-title">
                                        {findAreaByKeyPrefix('IspezioniFormArea2') || <div>- -</div>}
                                        {findAreaByKeyPrefix('IspezioniTableNameArea2') || <div>- -</div>}
                                    </div>
                                    {findAreaByKeyPrefix('IspezioniSearchArea2', { searchText: searchText1, setSearchText: setSearchText1 }) || <div>- -</div>}
                                </div>
                                <div className="pt-1">
                                    {findAreaByKeyPrefix('IspezioniArea1', { TableData1 }) || <div>- -</div>}
                                    {totalDocuments1 > perPageItem1 && (
                                        findAreaByKeyPrefix('PaginationArea1', { totalDocuments: totalDocuments1, currentPage: currentPage1, perPageItem: perPageItem1, handlePageClick }) || <div>- -</div>
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

export default MainLayout10;
