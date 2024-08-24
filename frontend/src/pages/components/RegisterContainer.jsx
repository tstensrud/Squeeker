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
            //console.log("Firebase userdata changed: ", firebaseUserData)
            registerUser(userData);
            //console.log("Registered userdata: ", userData)
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
            //console.log(res);
            const newUuid = res.user.uid;
            //console.log(res.user.uid);
            setFirebaseUserdata({
                uuid: newUuid,
            });

        } catch (err) {
            //console.log(err)
            setError(err.message);
        }
    }

    const closeContainer = () => {
        setShowRegisterContainer(false);
    }

    return (
        <>
            <div className="fixed h-full w-full justify-center items-center z-50 bg-login-bg ">
                <div className="w-full h-full flex flex-col justify-center items-center">
                    <div className="flex flex-col bg-card-bg-color p-6 w-96 h-96 justify-center items-center text-center rounded-lg">

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
                                        <div className="mb-4">
                                            <input className="h-10 w-80 bg-app-bg-color p-3 text-header-link-hover rounded-lg border text-sm border-border-color focus:border-form-focus outline-none hover:border-form-hover" id="email" onChange={handleInputChange} type="text" placeholder="E-mail" />
                                        </div>
                                        <div className="mb-4">
                                            <input className="h-10 w-80 bg-app-bg-color p-3 text-header-link-hover rounded-lg border text-sm border-border-color focus:border-form-focus outline-none hover:border-form-hover" id="password" onChange={handlePasswordChange} type="password" placeholder="Password" />
                                        </div>
                                        <div className="mb-4">
                                            <input className="h-10 w-80 bg-app-bg-color p-3 text-header-link-hover rounded-lg border text-sm border-border-color focus:border-form-focus outline-none hover:border-form-hover" id="username" onChange={handleInputChange} type="text" placeholder="Username" />
                                        </div>
                                        <div className="mb-4">
                                            <button className="bg-app-bg-color cursor-pointer border rounded-lg border-border-color p-1 h-10 w-24 text-grey-text transition:all 0.3 ease-in hover:border-link-green" type="submit">Register</button>
                                        </div>
                                    </form>

                                    <p>
                                        {registerError && registerError}
                                    </p>
                                    <p>
                                        {error && error}
                                    </p>
                                    <div>
                                        <Link to="#"  onClick={closeContainer}>Close</Link>
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