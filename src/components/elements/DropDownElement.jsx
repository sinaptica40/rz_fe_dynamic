import React from "react";

const DropDownElement = ({ areas }) => {
    let { element_data } = areas;
    return (
        <>
            <select
                className="form-select form-control"
                id="floatingSelect"
                aria-label="Floating label select example"
            >
                <option selected="">Selezionare Tipo di Norma</option>
                <option value={1}>One</option>
                <option value={2}>Two</option>
                <option value={3}>Three</option>
            </select>
            <label htmlFor="floatingSelect">{element_data.block_name}</label>
        </>
    )
}

export default DropDownElement