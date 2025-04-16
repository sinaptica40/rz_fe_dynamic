import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { loadScript } from '../utils/helper';

const ScriptLoader = () => {
    const location = useLocation(); 

    useEffect(() => {
        loadScript()
    }, [location]); 

    return null; 
};

export default ScriptLoader;