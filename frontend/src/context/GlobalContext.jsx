import React, { createContext, useEffect, useState } from 'react';

const GlobalContext = createContext();

const  GlobalProvider = ({ children }) => {

    const [test, setTest] = useState("test");

    const value = {
        test,
        setTest,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    )
}

export { GlobalContext, GlobalProvider }