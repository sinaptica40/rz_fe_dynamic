import React, { useCallback, useEffect, useState, useRef } from "react";
import { useDeleteNormMutation, useGetMachineryQuery, useGetUserDetailsQuery } from "../../services/apiSlice";
import { useLocation, useParams } from "react-router-dom";
import Loader from "../../lib/loader/loader";
import { toast } from 'react-toastify';
import { useSelector } from "react-redux";

const MainLayout3 = ({ areas }) => {
    const loaction = useLocation();
    const route = loaction.pathname.substring(1) || '/';
    const params = useParams()
    const [showModal, setShowModal] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [deletedId, setDeletedId] = useState(null);

    const modalRef = useRef(null);

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

    const apiData = areas.find(
        (item) => item?.props?.children?.props?.children?.[0]?.props?.areas?.element_type === "table"
    );

    const getDeleteApi = apiData?.props?.children?.props?.children?.[0]?.props?.nestedElements?.reduce((acc, data) => {
        const function_name = data?.props?.children?.props?.children?.props?.api?.function_name;
        const methodType = data?.props?.children?.props?.children?.props?.api?.method_type;
        if (function_name && acc === undefined) {
            return { deleteApiURL: function_name, deleteApiMethod: methodType }
        }
        return acc;
    }, undefined);

    let getapi;
    getapi = allApis?.reduce((acc, user) => {
        const key = user?.key;
        const functionName = user?.props?.children?.props?.children?.props?.api?.function_name;
        const api_Method = user?.props?.children?.props?.children?.props?.api?.method_type;

        if (key.includes("MachinerySearchArea")) {
            acc.apiURL = functionName;
            acc.apiMethod = api_Method;
        }

        if (key?.includes("HeaderArea4-3")) {
            acc.userDetailsApi = functionName;
            acc.userDetailsApiMethod = api_Method;
        }
        return acc;
    }, {});

    const { trigger, data, isFetching, error, refetch } = useGetMachineryQuery(
        {
            endpointName: getapi.apiURL,
            method: getapi.apiMethod,
            params: {
                page: currentPage,
                ...(searchText ? { search: searchText } : {}),
            },
            refetchOnMountOrArgChange: true,
        },

    );

    const [deleteNorm, { isLoading }] = useDeleteNormMutation();

    useCallback(() => {
        if (params["*"]) {
            getapi = {}
            trigger()
        }
    }, [params["*"]])

    useEffect(() => {
        if (params["*"] === `${route}` && currentPage !== 1) {
            setCurrentPage(1);
        }
        if (params["*"] === `${route}`) {
            setSearchText("")
        }
    }, [params["*"], route]);

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected + 1)
    };

    let perPageItem = data?.pagination?.per_page;

    const totalDocuments = data?.pagination?.total_items;

    const handleModal = (id) => {
        setDeletedId(id)
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

    const handleDeleteNorme = async () => {
        console.log('delete norme')
        try {
            const res = await deleteNorm({
                url: getDeleteApi.deleteApiURL,
                method: getDeleteApi.deleteApiMethod,
                params: deletedId
            })
            console.log(res,'check res')

            if (res?.data?.status == "SUCCESS") {
                toast.success(res?.data?.message);
                refetch();
                setDeletedId(null);
                setShowModal(false);
            } else if (res?.data?.status == "ERROR") {
                toast.error(res?.data?.message);
                setShowModal(false);
            }
        } catch (error) {
            toast.error(error)
        }
    }

    const {data: userDetails, isFetchingg} = useGetUserDetailsQuery({
        url: getapi?.userDetailsApi,
        method: getapi?.userDetailsApiMethod,
        refetchOnMountOrArgChange: true,
        })

    return (
        <>
            {isFetching && (<Loader />)}
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
                    {findAreaByKeyPrefix('MachineryArea1')}
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="cards-block Ispezioni-block">
                                <div className="card-header border-0 add-form-header pb-0">
                                    <div className="card-title">
                                        {findAreaByKeyPrefix('FormArea7') || <div>- -</div>}
                                        {findAreaByKeyPrefix('MachineryTableNameArea') || <div>- -</div>}
                                    </div>
                                    {findAreaByKeyPrefix('MachinerySearchArea', { setSearchText, searchText }) || <div>- -</div>}
                                </div>
                                <div className="card-block-body">
                                    {findAreaByKeyPrefix('MachineryArea2', { data, handleModal, modalRef, showModal, setShowModal, handleDeleteNorme }) || <div>- -</div>}
                                    {totalDocuments > perPageItem ? (
                                        findAreaByKeyPrefix('PaginationArea', { totalDocuments, currentPage, perPageItem, handlePageClick }) || <div>- -</div>
                                    ) : (
                                        ""
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

export default MainLayout3;
