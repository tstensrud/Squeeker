import React, { createContext, useEffect, useState } from 'react';

const GlobalContext = createContext();

const  GlobalProvider = ({ children }) => {

    const [selectedIndex, setSelectedIndex] = useState(0);

    const value = {
        selectedIndex,
        setSelectedIndex,
    };

    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    )
}

export { GlobalContext, GlobalProvider }