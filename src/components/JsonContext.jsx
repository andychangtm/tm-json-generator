import { createContext, useContext, useEffect, useState } from 'react';

const JsonContext = createContext(null);
const JsonContextDispatchContext = createContext(null);

export function useJsonData(){
    return useContext(JsonContext);
}

export function useJsonContextDispatch(){
    return useContext(JsonContextDispatchContext);
}

export function JsonProvider({children}){
    const [jsonInput, setJsonInput] = useState(localStorage.getItem("json_input") || "");

    const handleInputChange = (value) => {
        setJsonInput(value);
        localStorage.setItem("json_input", value);
    };

    return (
        <JsonContext.Provider value={{ jsonInput, setJsonInput }}>
            <JsonContextDispatchContext.Provider value={{handleInputChange}}>
                {children}
            </JsonContextDispatchContext.Provider>   
        </JsonContext.Provider>
    );
}