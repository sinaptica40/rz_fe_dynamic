import React from 'react'

const NormeSearchElement = ({ areas, setSearchText, searchText }) => {
    return (
        <>
            <button className="cardSearchIcon">
                <img src={areas?.element_data?.interaction_name} />
            </button>
            <input
                value={searchText}
                type="text"
                className="form-control"
                placeholder="Cerca un Macchinario"
                onChange={(e) => setSearchText(e.target.value)}
            />
        </>
    )
}

export default NormeSearchElement