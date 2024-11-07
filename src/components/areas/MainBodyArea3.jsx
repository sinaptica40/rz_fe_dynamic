import React from "react";

const NotificationArea = ({ children }) => {
    console.log("==NotificationArea==", children)
    return (
        <>
            <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-4">
                <div className="cards-block notification-block mb-block">
                    {children}
                </div>
            </div>

        </>
    )
};

export default NotificationArea;
