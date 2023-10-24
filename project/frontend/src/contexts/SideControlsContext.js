import { createContext, useState } from 'react';

const SideControlsContext = createContext();

function SideControlsProvider({ children }) {
    const LOCAL_STORAGE_DATASETS_KEY = 'datasets';
    const [datasetSize, setDatasetSize] = useState(window.localStorage.getItem(LOCAL_STORAGE_DATASETS_KEY) || 0);

    return (
        <SideControlsContext.Provider value={{
            LOCAL_STORAGE_DATASETS_KEY,
            datasetSize,
            setDatasetSize,
        }}>
            {children}
        </SideControlsContext.Provider>
    );
}

export { SideControlsContext, SideControlsProvider };