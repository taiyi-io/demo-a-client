'use client';
import { createContext, useContext } from 'react';

const defaultContext = {
    lang: 'cn',
    user: 'demo',
};

const AppContext = createContext(defaultContext);

export function useAppContext(){
    return useContext(AppContext);
}

export function ContextProvider({lang, user, children}){
    var value = {
        lang: lang,
        user: user,
    };
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}