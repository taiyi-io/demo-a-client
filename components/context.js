'use client';
import { createContext, useContext } from 'react';

const AppContext = createContext();

export function useAppContext(){
    return useContext(AppContext);
}

export function ContextProvider({lang, children}){
    var defaultContext = {
        lang: lang,
    };
    return (
        <AppContext.Provider value={defaultContext}>
            {children}
        </AppContext.Provider>
    )
}