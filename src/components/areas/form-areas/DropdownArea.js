import React from 'react';

const DropdownArea = ({ data }) => {
    let { block_name, type } = data;
    return (
        <>
            <div className="form-floating">
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
                <label htmlFor="floatingSelect">{block_name}</label>
            </div>
        </>
    );
};

export default DropdownArea;
