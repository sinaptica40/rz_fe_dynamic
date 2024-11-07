import React from "react";

const TableLayout = ({ children }) => {
    console.log("==TableLayout==", children)
    return (
        <>
            <div className="col-md-12 col-lg-6 col-xl-6 col-xxl-4">
                <div className="cards-block Sezione-block mb-block">
                    {children}
                </div>
            </div>
        </>

    )
};

export default TableLayout;
