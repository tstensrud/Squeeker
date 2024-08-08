import { useState } from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';

import useRegister from '../hooks/useRegister';
import {BASE_URL} from '../utils/globalVariables';


function Register() {
    const [userData, setUserData] = useState({});
    const [error, setError] = useState("");
    const {data, loading, error: registerError, registerUser} = useRegister(`${BASE_URL}/api/register/`);
    
    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.id]: e.target.value,
        })
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
           const res = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
           const newUuid = res.user.uid;
           //console.log(res.user.uid);
           setUserData(prevState => {
                const updatedData = {
                    ...prevState,
                    uuid: newUuid,
            };
            registerUser(updatedData);
        });
           
        } catch (err) {
            console.log(err)
            setError(err.message);
        }
    }

    return (
        <>
            <div className="login-container">
                <div className="login-card">
                    <span>Register</span> <br />
                    <form onSubmit={handleRegister}>
                        <input id="email" onChange={handleInputChange} type="text" placeholder="E-mail" />
                        <br />
                        <input id="password" onChange={handleInputChange} type="password" placeholder="Password" />
                        <br />
                        <input id="username" onChange={handleInputChange} type="text" placeholder="Username" />
                        <br />
                        <button type="submit">Register</button>
                    </form>
                    <br />
                    {registerError && registerError}
                    <br />
                    {error && error}
                </div>
            </div>
        </>
    );
}

export default Register;