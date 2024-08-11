import { useState, useContext } from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../utils/firebase';

import useRegister from '../hooks/useRegister';
import { BASE_URL } from '../utils/globalVariables';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


function Register() {
    const [userData, setUserData] = useState({});
    const [error, setError] = useState("");
    const navigate = useNavigate()
    const { currentUser, idToken } = useContext(AuthContext);
    const { data, loading, error: registerError, registerUser } = useRegister(`${BASE_URL}/api/register/`);

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

        navigate("/");
    }

    return (
        <>
            <div className="login-container">
                <div className="login-card">
                    <h3>Register</h3>
                    {
                        idToken ? (<>You are curreny logged in to an account.</>) : (
                            <>
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
                                <p>
                                    {registerError && registerError}
                                </p>
                                <p>
                                    {error && error}
                                </p>
                            </>
                        )
                    }

                </div>
            </div>
        </>
    );
}

export default Register;