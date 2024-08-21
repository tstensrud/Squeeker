import { createContext, useEffect, useReducer } from "react";
import {  onAuthStateChanged, onIdTokenChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';
import AuthReducer from "./AuthReducer";

const INITIAL_STATE = {
    currentUser: JSON.parse(localStorage.getItem("user")) || null,
    idToken: null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
        //const unsubscribe = onIdTokenChanged(auth, async (user) => {
            if (user) {
                localStorage.setItem("user", JSON.stringify(user));
                const idToken = await user.getIdToken();
                //console.log("ID Token:", idToken);
                dispatch({ type: "LOGIN", payload: {user, idToken} });
                
            } else {
                localStorage.removeItem("user");
                dispatch({ type: "LOGOUT" });
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{currentUser: state.currentUser, idToken: state.idToken, dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}