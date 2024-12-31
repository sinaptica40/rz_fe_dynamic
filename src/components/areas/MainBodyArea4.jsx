import React from "react";

const TableAreaWider = ({ children }) => {
    return (
        <>
            <div className="col-xl-8 col-lg-12">
                <div className="cards-block Ispezioni-block">
                    {children}
                </div>
            </div>
        </>

    )
};

export default TableAreaWider;
