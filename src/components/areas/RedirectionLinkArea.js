import React from 'react';

const RedirectionLinkArea = ({ children }) => {
    console.log('==RedirectionLinkArea==', children)
    return (
        <>
            <div className="forget_passwordBox">
                <a href="forgot-password.html" className="forget_pass">
                    Recupera le credenziali
                </a>
            </div>
        </>
    );
};

export default RedirectionLinkArea;
