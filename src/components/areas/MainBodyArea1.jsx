import React from "react";

const AccordionLayout = ({ children }) => {

    return (
        <>
            <div className="col-md-12 col-lg-12 col-xl-12 col-xxl-4">
                <div className="dash_sidebar_box">
                    {children}
                </div>
            </div>
        </>

    )
};

export default AccordionLayout;
