import React from 'react';

const TextArea = ({ data }) => {
    let { block_name, type } = data;
    return (
        <>
            <div className="form-floating">
                <input
                    type="email"
                    className="form-control"
                    id="floatingInput"
                    placeholder="Nome Macchinario"
                    defaultValue={block_name}
                />
                <label htmlFor="floatingInput">{block_name}</label>
            </div>
        </>
    );
};

export default TextArea;
