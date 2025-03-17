import React from "react";

const ButtonElement = ({ areas, handleDeleteNotifiche }) => {

    // const name = areas.element_data.block_name;
    // onClick={handleDelete}
    const areaData = areas?.element_data
    console.log(areas, 'check the data')
    return (
        <>
           <button type="button" onClick={() =>handleDeleteNotifiche()} className={`p-2 rounded px-4 bg-white border-0`}>{areaData?.data?.html_name}</button>
        </>
    )
}

export default ButtonElement