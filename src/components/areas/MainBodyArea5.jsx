import React from "react";

const CalendarArea = ({ children }) => {
    return (
        <>
            <div className="col-xl-4 col-lg-12 ">
                <div className="cards-block Ispezioni-block calender-block">
                { children }
                </div>
            </div>
        </>

    )
};

export default CalendarArea;
