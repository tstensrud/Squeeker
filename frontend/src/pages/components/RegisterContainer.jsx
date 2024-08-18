import { useState, useContext, useEffect } from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';

import useRegister from '../../hooks/useRegister';
import { BASE_URL } from '../../utils/globalVariables';
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";


function RegisterContainer({ refetchUserData, setShowRegisterContainer }) {
    const [userData, setUserData] = useState({});
    const [firebaseUserData, setFirebaseUserdata] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const { currentUser, idToken } = useContext(AuthContext);
    const { data, loading, error: registerError, registerUser } = useRegister(`${BASE_URL}/api/register/${firebaseUserData.uuid}/`);

    useEffect(() => {
        if (firebaseUserData) {
            console.log("Firebase userdata changed: ", firebaseUserData)
            registerUser(userData);
            console.log("Registered userdata: ", userData)
            setShowRegisterContainer(false);
            refetchUserData();
        }
    }, [firebaseUserData])

    // Handlers
    const handleInputChange = (e) => {
        setUserData({
            ...userData,
            [e.target.id]: e.target.value,
        })
    }

    const handlePasswordChange = (e) => {
        setPassword(
            e.target.value,
        )
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await createUserWithEmailAndPassword(auth, userData.email, password);
            console.log(res);
            const newUuid = res.user.uid;
            //console.log(res.user.uid);
            setFirebaseUserdata({
                uuid: newUuid,
            });

        } catch (err) {
            console.log(err)
            setError(err.message);
        }
    }

    const closeContainer = () => {
        setShowRegisterContainer(false);
    }

    return (
        <>
            <div className="login-wrapper">
                <div className="login-container">
                    <div className="login-card">
                        <h3>Register</h3>
                        {
                            idToken ? (<>
                                <div>You are curreny logged in to an account.</div>
                                <div>
                                    <Link className="link-card" to="#" onClick={closeContainer}>Close</Link>
                                </div>
                            </>) : (
                                <>
                                    <form onSubmit={handleRegister}>
                                        <input id="email" onChange={handleInputChange} type="text" placeholder="E-mail" />
                                        <br />
                                        <input id="password" onChange={handlePasswordChange} type="password" placeholder="Password" />
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
                                    <div>
                                        <Link className="link-card" to="#" onClick={closeContainer}>Close</Link>
                                    </div>
                                </>
                            )
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default RegisterContainer;