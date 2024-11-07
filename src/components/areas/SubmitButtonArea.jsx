import React from 'react';

const SubmitButtonArea = ({ children }) => {
    console.log('==SubmitButtonArea==', children)
    return (
        <>
            <button
                type="submit"
                className="btn-primary btn-login"
                onclick="document.location='index.html'"
            >
                Login
            </button>
        </>
    );
};

export default SubmitButtonArea;
