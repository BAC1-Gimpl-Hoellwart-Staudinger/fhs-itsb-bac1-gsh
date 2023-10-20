import React, { createContext } from 'react';

const SideControlsContext = createContext();

function SideControlsProvider({ children }) {
    return (
        <SideControlsContext.Provider value={{
        }}>
            {children}
        </SideControlsContext.Provider>
    );
}

export { SideControlsContext, SideControlsProvider };