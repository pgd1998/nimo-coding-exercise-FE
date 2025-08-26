import { createContext, useContext, useState } from 'react';

const PinContext = createContext({});


export const usePinContext = () => {
    const context = useContext(PinContext);
    if (!context) {
        throw new Error('usePinContext must be used within a ThemeContextProvider');
    }
    return context;
};

export const PinContextProvider = ({ children }) => {

    const [pin, setPinnedData] = useState([]);
    
    const addPinCrypto = ({id, name}) => {
        if (!pin.find((crypto)=>crypto.id===id)){
            setPinnedData((prev)=>[...prev,{id,name}])
        }
    }

    const remove = (id)=>{
        setPinnedData((prev)=>prev.filter((crypto)=>crypto.id!==id));
    }
    
    

    const contextValue = {
        pin,
        addPinCrypto,
        remove
    }

    return (
        <PinContext.Provider value={contextValue}>
            {children}
        </PinContext.Provider>
    )

}