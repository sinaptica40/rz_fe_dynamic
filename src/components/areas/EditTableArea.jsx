import React from "react";

const EditTableArea = ({ children }) => {
    console.log('==EditTableArea==', children)
    return (
        <>
            {/* <table className="table m b-0"> */}
            {children[0]}
            {/* </table> */}
        </>
    )
}

export default EditTableArea