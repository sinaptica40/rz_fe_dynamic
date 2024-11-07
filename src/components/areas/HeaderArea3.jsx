import React from 'react';

const ProfileArea = ({ children }) => {
    return (
        <>
            <div className="nav-item dropdown user_dropdown">
                {children}
            </div>
        </>
    );
};

export default ProfileArea;
