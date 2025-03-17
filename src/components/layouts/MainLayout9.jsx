import React, { useCallback, useEffect, useState, useRef } from "react";
import {useDeleteNotificheMutation, useGetNotificheQuery, useGetUserDetailsQuery } from "../../services/apiSlice";
import { useLocation, useParams } from "react-router-dom";
import Loader from "../../lib/loader/loader";
import { toast } from 'react-toastify';

const MainLayout3 = ({ areas }) => {
    const loaction = useLocation();

    const route = loaction.pathname.substring(1) || '/';
    const params = useParams()
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

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



    let getapi;
    let deleteapi;
    getapi = allApis?.reduce((acc, user) => {
        const key = user?.key;
        const functionName = user?.props?.children?.props?.children?.props?.api?.function_name;
        const api_Method = user?.props?.children?.props?.children?.props?.api?.method_type;

        if (key.includes("PaginationArea-8")) {
            acc.apiURL = functionName;
            acc.apiMethod = api_Method;
        }
        if (key?.includes("HeaderArea4-4")) {
            acc.userDetailsApi = functionName;
            acc.userDetailsApiMethod = api_Method;
        }
        return acc;
    }, {});
    deleteapi = allApis?.reduce((acc, user) => {
        const key = user?.key;
        const functionName = user?.props?.children?.props?.children?.props?.api?.function_name;
        const api_Method = user?.props?.children?.props?.children?.props?.api?.method_type;

        if (key.includes("ButtonArea-10")) {
            acc.apiURL = functionName;
            acc.apiMethod = api_Method;
        }
        return acc;
    }, {});

    const { trigger, data, isFetching, error, refetch } = useGetNotificheQuery(
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


    const [deleteNotifiche, { isLoading:loader }] = useDeleteNotificheMutation();

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


    const handleDeleteNotifiche = async() =>{
        try {
            const res = await deleteNotifiche({
                url: deleteapi.apiURL,
                method: deleteapi.apiMethod,
            })

            if (res?.data?.status === "SUCCESS") {
                toast.success(res?.data?.message);
                refetch();
            } else if (res?.error) {
                toast.error(res?.error?.data?.message);
            }
        } catch (error) {
            toast.error(error)
        }
    }


   // user details
   const {data: userDetails , isFetchingg} = useGetUserDetailsQuery({
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
                <div className="card-header">
                <div className="card-title">
                    <span className="title-icon">
                        <svg
                            width="23"
                            height="26"
                            viewBox="0 0 23 26"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M22.542 19.2577C21.3193 16.477 20.7382 13.4566 20.842 10.4207C20.842 7.91441 19.8464 5.51076 18.0742 3.73854C16.3019 1.96633 13.8983 0.970703 11.392 0.970703C8.8857 0.970703 6.48206 1.96633 4.70984 3.73854C2.93762 5.51076 1.942 7.91441 1.942 10.4207C2.04418 13.4571 1.46108 16.4775 0.236002 19.2577C0.0866438 19.5156 0.0076999 19.8082 0.00708371 20.1062C0.00646753 20.4042 0.0842006 20.6971 0.232491 20.9556C0.380781 21.2141 0.594418 21.4291 0.851984 21.579C1.10955 21.7289 1.40199 21.8085 1.7 21.8097H6.847C7.01816 22.8917 7.56982 23.877 8.40272 24.5885C9.23561 25.3 10.2951 25.6909 11.3905 25.6909C12.4859 25.6909 13.5454 25.3 14.3783 24.5885C15.2112 23.877 15.7628 22.8917 15.934 21.8097H21.085C21.3828 21.8079 21.6748 21.728 21.932 21.5779C22.1891 21.4278 22.4023 21.2128 22.5503 20.9544C22.6982 20.6959 22.7757 20.4032 22.7749 20.1055C22.7742 19.8077 22.6952 19.5154 22.546 19.2577H22.542ZM11.387 24.2327C10.6781 24.2325 9.99008 23.9932 9.43407 23.5535C8.87806 23.1138 8.4866 22.4994 8.323 21.8097H14.451C14.2874 22.4994 13.8959 23.1138 13.3399 23.5535C12.7839 23.9932 12.0959 24.2325 11.387 24.2327ZM21.287 20.2327C21.267 20.2698 21.2373 20.3007 21.2009 20.322C21.1646 20.3434 21.1231 20.3543 21.081 20.3537H1.695C1.65288 20.3543 1.61139 20.3434 1.57506 20.322C1.53873 20.3007 1.50896 20.2698 1.489 20.2327C1.46776 20.1959 1.45658 20.1542 1.45658 20.1117C1.45658 20.0692 1.46776 20.0275 1.489 19.9907C2.406 18.4157 3.389 14.7437 3.389 10.4197C3.4547 8.34281 4.32593 6.37297 5.8183 4.92706C7.31067 3.48116 9.30707 2.67265 11.385 2.67265C13.4629 2.67265 15.4593 3.48116 16.9517 4.92706C18.4441 6.37297 19.3153 8.34281 19.381 10.4197C19.381 14.7427 20.367 18.4097 21.281 19.9907C21.3035 20.0272 21.316 20.069 21.317 20.1119C21.3181 20.1548 21.3077 20.1971 21.287 20.2347V20.2327Z"
                                fill="#ECAD42"
                            />
                        </svg>
                    </span>
                    <span>{"Notifiche"}</span>
                </div>
            </div>

            <div className="col-lg-12 p-0">
                <div className="cards-block Ispezioni-block">
                     <div className="card-header border-0 pb-0 add-form-header">
                        <div className="card-title">
                            <div>
                            {findAreaByKeyPrefix('MachineryTableNameArea') || <div>- -</div>}
                            </div>
                        </div>
                        {data?.data?.length > 0 &&
                            <div>
                        {findAreaByKeyPrefix("ButtonArea", {handleDeleteNotifiche})}
                        </div>
                        }

                    </div> 

                    <div className="card-block-body">
                    {findAreaByKeyPrefix('MachineryArea2', {data}) || <div>- -</div>}       
                    </div>
                    {totalDocuments > perPageItem && (
                    <div>{findAreaByKeyPrefix('PaginationArea',{ totalDocuments: totalDocuments, currentPage: currentPage, perPageItem: perPageItem, handlePageClick }) || <div>- -</div>}</div>
                    )}
                    </div>
            </div>
                    
                </div>
            </div>
        </>
    );
};

export default MainLayout3;
