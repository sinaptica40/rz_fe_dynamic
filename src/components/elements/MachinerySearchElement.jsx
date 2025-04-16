import React from 'react'

const MachinerySearchElement = ({ areas, setSearchText, searchText }) => {
    return (
        <>
            <button className="cardSearchIcon">
                <img src={areas?.element_data?.interaction_name} />
            </button>
            <input
                value={searchText}
                type="text"
                className="form-control"
                placeholder="Ricerca"
                onChange={(e) => setSearchText(e.target.value)}
            />
        </>
    )
}

export default MachinerySearchElement