import { useState, useContext, useEffect } from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';

import useRegister from '../../hooks/useRegister';
import { BASE_URL } from '../../utils/globalVariables';
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";


function RegisterContainer({ setShowLoginCointainer, setShowRegisterContainer }) {
    const [userData, setUserData] = useState({});
    const [error, setError] = useState("");
    const [passwordMatch, setPasswordMatch] = useState("");
    const { currentUser, idToken } = useContext(AuthContext);

    //const { data, loading, error: registerError, registerUser } = useRegister(`${BASE_URL}/api/register/${firebaseUserData.uuid}/`);
    const { data, loading, error: registerError, registerUser } = useRegister(`${BASE_URL}/user/register/`);


    useEffect(() => {
        if (data?.success === false) {
            setError(data.message);
        }
        if (data?.success === true) {
            setShowRegisterContainer(false);
            setShowLoginCointainer(true);
        }
    }, [data])


    // Handlers
    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.id]: e.target.value,
        })
    }

    const checkPasswordMatch = () => {
        if (userData.password === userData.password_two) {
            return true
        } else {
            return false
        }
    }
    const handleRegister = async (e) => {
        e.preventDefault();
        if (checkPasswordMatch()) {
            registerUser(userData);
        } else {
            setPasswordMatch("Passwords does not match")
        }

    }

    const closeContainer = () => {
        setShowRegisterContainer(false);
    }

    return (
        <div className="fixed h-full w-full justify-center items-center z-50 bg-login-bg ">
            <div className="w-full h-full flex flex-col justify-center items-center">
                <div className="flex flex-col bg-secondary-color p-6 w-96 h-auto justify-center items-center text-center rounded-lg">

                    <h3>Register</h3>
                    {
                        idToken ? (
                        <>
                            <div>You are curreny logged in to an account.</div>
                            <div>
                                <Link className="link-card" to="#" onClick={closeContainer}>Close</Link>
                            </div>
                        </>
                        ) : (
                            <>
                                <form onSubmit={handleRegister}>
                                    <div className="mb-4">
                                        <input id="email" onChange={handleInputChange} type="text" placeholder="E-mail" tabIndex="1" />
                                    </div>
                                    <div className="mb-4">
                                        <input id="password" onChange={handleInputChange} type="password" placeholder="Password" tabIndex="2" />
                                    </div>
                                    <div className="mb-4">
                                        <input id="password_two" onChange={handleInputChange} type="password" placeholder="Re-type password" tabIndex="3" />
                                        {passwordMatch}
                                    </div>
                                    <div className="mb-4">
                                        <input id="username" onChange={handleInputChange} type="text" placeholder="Username" tabIndex="4" />
                                    </div>
                                    <div className="mb-4">
                                        <button type="submit" tabIndex="5">Register</button>
                                    </div>
                                </form>

                                <p>
                                    {registerError && registerError}
                                </p>
                                <p>
                                    {error && error}
                                </p>
                                <div>
                                    <Link to="#" onClick={closeContainer}>Close</Link>
                                </div>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default RegisterContainer;