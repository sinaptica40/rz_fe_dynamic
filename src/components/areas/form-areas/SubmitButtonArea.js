import React from 'react';

const SubmitButtonArea = ({ data }) => {
    let { block_name, type } = data;
    return (
        <>
            <div className="">
                <button
                    type="submit"
                    className="btn-primary"
                    onclick="document.location='macchinari.html'"
                >
                    {block_name}
                </button>
            </div>
        </>
    );
};

export default SubmitButtonArea;
