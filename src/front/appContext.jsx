import React, { createContext, useReducer } from "react";
// Importamos de ./store.js porque ahora están en la misma carpeta
import storeReducer, { initialStore } from "./store.js";
// Importamos tu servicio ajustando la ruta
import { logoutUser } from "./services/backendServices.js";

export const Context = createContext(null);

const injectContext = (PassedComponent) => {
    const StoreWrapper = (props) => {
        const [store, dispatch] = useReducer(storeReducer, initialStore());

        const actions = {
            setToken: (token) => {
                dispatch({ type: 'set_token', payload: token });
            },
            logout: () => {
                logoutUser();
                dispatch({ type: 'logout' });
            }
        };

        return (
            <Context.Provider value={{ store, actions }}>
                <PassedComponent {...props} />
            </Context.Provider>
        );
    };
    return StoreWrapper;
};

export default injectContext;