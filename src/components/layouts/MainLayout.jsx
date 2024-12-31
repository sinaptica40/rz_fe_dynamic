import React from "react";
import { useState } from "react";
import { useGetCalenderQuery, useGetInspectionsOrderQuery } from "../../services/apiSlice";

const MainLayout = ({ areas }) => {
    const [showModal, setShowModal] = useState(false);

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

    const handleModal = (clickedDateData) => {
        setShowModal(true);
    }

    // function for get All apis
    let getApi = areas.filter((item) => item?.props?.children?.props?.children?.props?.api != null
    ).reduce((acc, user) => {
        const key = user?.key;
        console.log("MainBodyArea4", key)
        const functionName = user.props.children.props.children.props.api.function_name;
        const api_Method = user?.props?.children?.props?.children?.props?.api?.method_type;

        if (key?.includes("MainBodyArea4")) {
            acc.getInspectionOrder = functionName;
            acc.getOderApiMethod = api_Method;
        }
        if (key?.includes("MainBodyArea5")) {
            acc.calenderApi = functionName;
            acc.calenderApiApiMethod = api_Method;
        }
        return acc;
    }, {})

    const { data: inspectionData, isFetching: isFetchingOrder } = useGetInspectionsOrderQuery({
        url: getApi.getInspectionOrder,
        params: {
            id_state: 0,
        },
        refetchOnMountOrArgChange: true,
    },
    );

    const { data: calenderData, isFetching } = useGetCalenderQuery({
        url: getApi.calenderApi,
        refetchOnMountOrArgChange: true,
    },
    );

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
                <div className="row g-xxl-5">
                    {findAreaByKeyPrefix('MainBodyArea1')}
                    {findAreaByKeyPrefix('MainBodyArea2')}
                    {findAreaByKeyPrefix('MainBodyArea3')}
                </div>
                <div className="row g-xxl-5">
                    {findAreaByKeyPrefix('MainBodyArea4', { inspectionData })}
                    {findAreaByKeyPrefix('MainBodyArea5', { calenderData, showModal, setShowModal, handleModal })}
                </div>
            </div>
        </>
    );
};

export default MainLayout;
