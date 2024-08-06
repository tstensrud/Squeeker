import { createContext, useEffect, useReducer } from "react";
import {  onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    currentUser: JSON.parse(localStorage.getItem("user")) || null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                dispatch({ type: "LOGIN", payload: user });
                //console.log(user.uid)
                
            } else {
                localStorage.removeItem("user");
                dispatch({ type: "LOGOUT" });
            }
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{currentUser: state.currentUser, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}