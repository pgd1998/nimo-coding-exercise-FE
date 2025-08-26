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

    const [pin,usePinnedData] = useState([]);
    
    const addPinCrypto = (id,name) => {
        console.log("called")
        // setTrackPin(()=>trackPin.filter((prev)=>prev.id!==id));
        // usePinnedData(()=>pin.find((prev)=>prev.id===id));
        if (!pin.find((crypto)=>crypto.id===id)){
            usePinnedData((prev)=>[...prev,{id,name}])
        } else{
            return;
        }
    }

    const remove = (id)=>{
        console.log("called")
        usePinnedData(()=>trackPin.filter((prev)=>prev.id!==id));
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