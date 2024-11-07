import React from 'react';
import { useNavigate } from 'react-router-dom';

const MenuArea = ({ children }) => {
    console.log('77 MenuArea', children)
    return (
        <>
            <div className="navcollapse navbar-collapse">
                {children}
            </div>
        </>
    );
};

export default MenuArea;
