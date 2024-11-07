import React from 'react';

const LogoArea = ({ children, api }) => {
    return (
        <>
            <a className="navbar-brand">
                {children}
            </a>
        </>
    );
};

export default LogoArea;
